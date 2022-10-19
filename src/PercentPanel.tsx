import React, { PropsWithChildren } from 'react';
import { PanelProps, getValueFormat, formattedValueToString } from '@grafana/data';
import { PercentPanelOptions } from 'types';
import { css, cx } from 'emotion';
import { useStyles, useTheme2 } from '@grafana/ui';

interface Props extends PanelProps<PercentPanelOptions> {}

const BASE_FONT_SIZE = 38;

function SpanValue({
  className,
  fontSize,
  color,
  lineHeight,
  children,
}: PropsWithChildren<{ className: string; fontSize: string; color?: string; lineHeight?: string }>) {
  return (
    <span
      className={className}
      style={{ display: 'block', fontSize: fontSize, color: color, lineHeight: lineHeight, whiteSpace: 'nowrap' }}
    >
      {children}
    </span>
  );
}

export const PercentPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles(getPanelStyles);

  const percentageValueFontSize = options.percentageValueFontSize.includes('px')
    ? options.percentageValueFontSize
    : (parseInt(options.percentageValueFontSize, 10) / 100) * BASE_FONT_SIZE + 'px';

  const positiveTrendColor = (options.positiveIsGood === undefined ? true : options.positiveIsGood)
    ? theme.visualization.getColorByName('green')
    : theme.visualization.getColorByName('red');

  const negativeTrendColor = (options.positiveIsGood === undefined ? true : options.positiveIsGood)
    ? theme.visualization.getColorByName('red')
    : theme.visualization.getColorByName('green');

  // Get values for calculating percentage
  const percentageValueSerie = data.series.find((serie) =>
    serie.fields.find((field) => field.name === options.percentageValueField)
  );
  const baseValueSerie = data.series.find((serie) =>
    serie.fields.find((field) => field.name === options.baseValueField)
  );

  if (!percentageValueSerie || !baseValueSerie) {
    return <p>Selected series are not available</p>;
  }

  const percentageValueField = percentageValueSerie.fields.find((field) => field.name === options.percentageValueField);
  const baseValueField = baseValueSerie.fields.find((field) => field.name === options.baseValueField);

  if (!percentageValueField || !baseValueField) {
    return <p>Selected fields are not available</p>;
  }
  if (percentageValueField.values.length === 0 || baseValueField.values.length === 0) {
    return <p>Selected fields are empty</p>;
  }

  const percentageValueSum = percentageValueField.values.toArray().reduce((sum, current) => sum + current, 0);
  const baseValueSum = baseValueField.values.toArray().reduce((sum, current) => sum + current, 0);

  const percent = options.interpretAsTrend
    ? ((percentageValueSum - baseValueSum) * 100) / baseValueSum
    : (percentageValueSum * 100) / baseValueSum;
  const percentFormatted =
    options.percentageNrDecimals !== -1 ? percent.toFixed(options.percentageNrDecimals) : percent;

  const percentageValueFormat = getValueFormat(options.unit)(percentageValueSum, -1, undefined, undefined);
  const percentageValueFormatted = formattedValueToString(percentageValueFormat);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div className={styles.textBox}>
        <SpanValue className="percenttrend-panel-base" fontSize={percentageValueFontSize} lineHeight="1em">
          {percentageValueFormatted}
        </SpanValue>
        {!options.interpretAsTrend ? (
          <SpanValue className="percenttrend-panel-percent" fontSize={options.baseValueFontSize}>
            {percentFormatted}%
          </SpanValue>
        ) : percent >= 0 ? (
          <SpanValue
            className="percenttrend-panel-percent"
            fontSize={options.baseValueFontSize}
            color={positiveTrendColor}
          >
            +{percentFormatted}% &#9650;
          </SpanValue>
        ) : (
          <SpanValue
            className="percenttrend-panel-percent"
            fontSize={options.baseValueFontSize}
            color={negativeTrendColor}
          >
            {percentFormatted}% &#9660;
          </SpanValue>
        )}
        <SpanValue className="percenttrend-panel-ref" fontSize={options.referenceTextFontSize}>
          {options.referenceText}
        </SpanValue>
      </div>
    </div>
  );
};

function getPanelStyles() {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      padding: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    `,
  };
}
