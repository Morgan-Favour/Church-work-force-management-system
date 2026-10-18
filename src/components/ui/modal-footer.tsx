type Props = {
  children: React.ReactNode;
};

export function ModalFooter({
  children,
}: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-3 border-t border-border bg-card px-6 py-4">
      {children}
    </div>
  );
}