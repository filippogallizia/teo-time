export const CardComponent = (props: any) => {
  return (
    <div className="shadow-md p-4" {...props}>
      {props.children}
    </div>
  );
};

export default CardComponent;
