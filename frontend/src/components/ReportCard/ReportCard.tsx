import { Popconfirm } from "antd";
import { Report } from "../../globalInterfaces";
import "./ReportCard.scss";
import BinIcon from "../../assets/icons/red-bin.svg";
import { truncateText } from "../../utils/truncateText";
import { Button } from "../Button/Button";
import { getIcon } from "../../utils/getIcon";
import { getDateDisplay } from "../../utils/getDateDisplay";
import { getPreviewCardFields } from "../../utils/getPreviewCardFields";
import { getReportTypeLabel } from "../../utils/getReportTypeLabel";

interface ReportCardProps {
  report: Report;
  onViewMore: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ReportCard = ({
  report,
  onViewMore,
  onDelete,
}: ReportCardProps) => {
  
  const fields = getPreviewCardFields(report);

  return (
    <div className="report-card">
      <div className="report-card__header">
        <div className="report-card__title">
          <img className="report-card__icon" src={getIcon(report)} alt="icon" />
          <h2>{getDateDisplay(report)}</h2>
        </div>
        <div className="report-card__meta">
          <p className="report-card__type">{getReportTypeLabel(report)}</p>
          <Popconfirm
            title="Delete report"
            description="Are you sure you want to delete this report?"
            onConfirm={() => onDelete(report.id)}
            okText="Yes"
            cancelText="No"
          >
            <button className="report-card__delete">
              <img src={BinIcon} alt="delete icon" />
            </button>
          </Popconfirm>
        </div>
      </div>

      <div className="report-card__content">
        <div className="report-card__field">
          <strong>{fields.field1.label}:</strong>{" "}
          <span className="report-card__value">{fields.field1.value}</span>
        </div>
        <div className="report-card__field">
          <strong>{fields.field2.label}:</strong>{" "}
          <span className="report-card__value">{fields.field2.value}</span>
        </div>
        <div className="report-card__field">
          <strong>{fields.field3.label}:</strong>{" "}
          <span className="report-card__text">
            {truncateText(fields.field3.value)}
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        text="View more"
        onClick={() => onViewMore(report.id)}
        className="report-card__button"
        fullWidth={false}
      />
    </div>
  );
};