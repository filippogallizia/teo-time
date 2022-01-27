export const ShrinkHeigthLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex-1 flex justify-center md:m-auto md:max-w-2xl pb-10">
      {children}
    </div>
  );
};

export const SelfCenterLayout = (props: any) => {
  return <div className="self-center m-4">{props.children}</div>;
};

export const SelfTopLayout = (props: any) => {
  return <div className="pt-10">{props.children}</div>;
};
