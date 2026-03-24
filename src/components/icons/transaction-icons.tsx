import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import {
  Landmark,
  Banknote,
  ArrowLeftRight,
  PieChart,
  RefreshCw,
  AlertTriangle,
  CircleCheck,
  Info,
} from "lucide-react";

export type TxIconSize = 16 | 20 | 24;

const sizeClass: Record<TxIconSize, string> = {
  16: "txn-icon--16",
  20: "txn-icon--20",
  24: "txn-icon--24",
};

export type TxIconProps = SVGProps<SVGSVGElement> & { size?: TxIconSize; className?: string };

const stroke = 1.75;

function baseProps(size: TxIconSize, className: string | undefined, props: SVGProps<SVGSVGElement>) {
  return {
    className: cn(sizeClass[size], className),
    strokeWidth: stroke,
    "aria-hidden": true as const,
    focusable: false as const,
    ...props,
  };
}

export function TxIconLoan({ size = 20, className, ...props }: TxIconProps) {
  return <Landmark {...baseProps(size, className, props)} />;
}

export function TxIconWithdraw({ size = 20, className, ...props }: TxIconProps) {
  return <Banknote {...baseProps(size, className, props)} />;
}

export function TxIconTransfer({ size = 20, className, ...props }: TxIconProps) {
  return <ArrowLeftRight {...baseProps(size, className, props)} />;
}

export function TxIconRebalance({ size = 20, className, ...props }: TxIconProps) {
  return <PieChart {...baseProps(size, className, props)} />;
}

export function TxIconRollover({ size = 20, className, ...props }: TxIconProps) {
  return <RefreshCw {...baseProps(size, className, props)} />;
}

export function TxIconWarning({ size = 20, className, ...props }: TxIconProps) {
  return <AlertTriangle {...baseProps(size, className, props)} />;
}

export function TxIconSuccess({ size = 20, className, ...props }: TxIconProps) {
  return <CircleCheck {...baseProps(size, className, props)} />;
}

export function TxIconInfo({ size = 20, className, ...props }: TxIconProps) {
  return <Info {...baseProps(size, className, props)} />;
}
