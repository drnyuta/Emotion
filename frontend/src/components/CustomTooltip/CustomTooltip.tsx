/* eslint-disable @typescript-eslint/no-explicit-any */
import './CustomTooltip.scss';

export const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip">
          <p className="tooltip__label">{data.name}</p>
          <p className="tooltip__value">Count: {data.value}</p>
        </div>
      );
    }
    return null;
  };