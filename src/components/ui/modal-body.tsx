type Props = {
  children: React.ReactNode;
};

export function ModalBody({ children }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {children}
    </div>
  );
}