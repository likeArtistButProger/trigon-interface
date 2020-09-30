import React, { useState, useMemo } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';
import { PatternLines } from '@visx/pattern';
import { LinearGradient } from '@visx/gradient';
import { max, extent } from 'd3-array';

import AreaChart from './AreaChart';

// Initialize some variables
let newDate = new Date().toISOString();
let sample = {date: newDate, close: 200}
console.log(sample);
const stock = appleStock.slice(1000);
const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = 'brush_pattern';
const GRADIENT_ID = 'brush_gradient';
export const accentColor = '#252529'; //'#7AC231';
export const background = '#42434B'; //'#42434B'; 
export const background2 = '#606166'; // '#7AC231';
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: 'white',
};

//
//
// trigon_green: "#7AC231",
// trigon_red: "#C11E0F",
// trigon_black: "#1D2024",
// trigon_gray: {
//   '100': "#606166",
//   '200': "#252529",
//   '300': "#42434B"
// }
//
//
//
//
//

// accessors
const getDate = (d) => new Date(d.date);
const getStockValue = (d) => d.close;

function Chart({
  compact = false,
  width,
  height,
  chart_data,
  margin = {
    top: 20,
    left: 75,
    bottom: 20,
    right: 20,
  },
}) {
  const [filteredStock, setFilteredStock] = useState(chart_data);

  const onBrushChange = (domain) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = chart_data.filter(s => {
      const x = getDate(s).getTime();
      const y = getStockValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredStock(stockCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact ? chartSeparation / 2 : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0);

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(filteredStock, getDate),
      }),
    [xMax, filteredStock],
  );
  const stockScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(filteredStock, getStockValue) || 0],
        nice: true,
      }),
    [yMax, filteredStock],
  );
  const brushDateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(chart_data, getDate),
      }),
    [xBrushMax],
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(chart_data, getStockValue) || 0],
        nice: true,
      }),
    [yBrushMax],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getDate(chart_data[0])) },
      end: { x: brushDateScale(getDate(chart_data[5])) },
    }),
    [brushDateScale],
  );

  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient id={GRADIENT_ID} from={background} to={background2} rotate={45} />
        <rect x={0} y={0} width={width} height={height} fill={`url(#${GRADIENT_ID})`} rx={14} />
        <AreaChart
          hideBottomAxis={compact}
          data={filteredStock}
          width={width}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          yMax={yMax}
          xScale={dateScale}
          yScale={stockScale}
          gradientColor={background2}
        />
        <AreaChart
          hideBottomAxis
          hideLeftAxis
          data={chart_data}
          width={width}
          yMax={yBrushMax}
          xScale={brushDateScale}
          yScale={brushStockScale}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          gradientColor={background2}
        >
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Brush
            xScale={brushDateScale}
            yScale={brushStockScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredStock(chart_data)}
            selectedBoxStyle={selectedBrushStyle}
          />
        </AreaChart>
      </svg>
    </div>
  );
}

export default Chart;