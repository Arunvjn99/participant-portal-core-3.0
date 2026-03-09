import { PageHeader } from "./PageHeader";

export interface ContributionHeaderProps {
  /** Main heading, e.g. "How much would you like to contribute?" */
  title: string;
  /** Plan type shown below the title, e.g. "to your Roth 401k" */
  planLabel: string;
}

/**
 * Page header for the Contribution step. Uses PageHeader typography scale.
 */
export function ContributionHeader({ title, planLabel }: ContributionHeaderProps) {
  return <PageHeader title={title} subtitle={`to your ${planLabel}`} />;
}
