export interface FilterSectionProps<T> {
  onApply?: (values: T) => void;
  onClear?: () => void;
  className?: string;
  isOpen?: boolean;
  showApply?: boolean;
  onSectionToogle?: () => void;
}
