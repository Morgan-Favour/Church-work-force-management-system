type Props = {
  children: React.ReactNode;
};

export function ModalFooter({
  children,
}: Props) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
      {children}
    </div>
  );
}