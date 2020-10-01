import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';


// const stock = appleStock.slice(800);
export const background = '#42434B';
export const background2 = '#606166';
export const accentColor = '#7AC231';
export const accentColorDark = '#1D2024';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// trigon_green: "#7AC231",
// trigon_red: "#C11E0F",
// trigon_black: "#1D2024",
// trigon_gray: {
//   '100': "#606166",
//   '200': "#252529",
//   '300': "#42434B"
// }

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d) => new Date(d.date);
const getStockValue = (d) => d.close;
const bisectDate = bisector(d => new Date(d.date)).left;

export default withTooltip(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    chart_data,
    tooltipTop = 0,
    tooltipLeft = 0,
  }) => {
    if (width < 10) return null;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [0, xMax],
          domain: extent(chart_data, getDate),
        }),
      [xMax],
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [yMax, 0],
          domain: [0, (max(chart_data, getStockValue) || 0) + yMax / 3],
          nice: false,
        }),
      [yMax],
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(chart_data, x0, 1);
        const d0 = chart_data[index - 1];
        const d1 = chart_data[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale],
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <GridRows
            scale={stockValueScale}
            width={xMax}
            strokeDasharray="3,3"
            stroke={accentColor}
            strokeOpacity={0.3}
            pointerEvents="none"
          />
          <GridColumns
            scale={dateScale}
            height={yMax}
            strokeDasharray="3,3"
            stroke={accentColor}
            strokeOpacity={0.3}
            pointerEvents="none"
          />
          <AreaClosed
            data={chart_data}
            x={d => dateScale(getDate(d))}
            y={d => stockValueScale(getStockValue(d))}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: yMax }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <Tooltip top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
              {`$${getStockValue(tooltipData)}`}
            </Tooltip>
            <Tooltip
              top={yMax - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
