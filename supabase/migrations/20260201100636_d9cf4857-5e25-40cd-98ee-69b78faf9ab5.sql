-- Add unique constraint for aggregated_prices upsert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'aggregated_prices_item_location_unique'
    ) THEN
        ALTER TABLE public.aggregated_prices
        ADD CONSTRAINT aggregated_prices_item_location_unique UNIQUE (item_id, location_id);
    END IF;
END $$;

-- Create RLS policy for inserting/updating aggregated prices (for edge function with service role)
DROP POLICY IF EXISTS "Service role can manage aggregated prices" ON public.aggregated_prices;

-- Create a function to update aggregated prices when new submissions come in
CREATE OR REPLACE FUNCTION public.update_aggregated_price()
RETURNS TRIGGER AS $$
DECLARE
    v_avg NUMERIC;
    v_min NUMERIC;
    v_max NUMERIC;
    v_count INTEGER;
    v_median NUMERIC;
BEGIN
    -- Calculate aggregates for the item/location combination
    SELECT 
        AVG(price),
        MIN(price),
        MAX(price),
        COUNT(*)
    INTO v_avg, v_min, v_max, v_count
    FROM public.price_submissions
    WHERE item_id = NEW.item_id
    AND location_id = NEW.location_id
    AND is_flagged = false;

    -- Calculate median
    SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY price)
    INTO v_median
    FROM public.price_submissions
    WHERE item_id = NEW.item_id
    AND location_id = NEW.location_id
    AND is_flagged = false;

    -- Upsert the aggregated price
    INSERT INTO public.aggregated_prices (item_id, location_id, avg_price, min_price, max_price, median_price, submission_count, last_updated)
    VALUES (NEW.item_id, NEW.location_id, v_avg, v_min, v_max, v_median, v_count, NOW())
    ON CONFLICT (item_id, location_id)
    DO UPDATE SET
        avg_price = EXCLUDED.avg_price,
        min_price = EXCLUDED.min_price,
        max_price = EXCLUDED.max_price,
        median_price = EXCLUDED.median_price,
        submission_count = EXCLUDED.submission_count,
        last_updated = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update aggregated prices
DROP TRIGGER IF EXISTS trigger_update_aggregated_price ON public.price_submissions;
CREATE TRIGGER trigger_update_aggregated_price
    AFTER INSERT ON public.price_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_aggregated_price();