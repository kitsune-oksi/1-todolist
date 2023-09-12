type ButtonProps = {
  title: string;
  callback: () => void;
  className?: string;
};

export const Button = (props: ButtonProps) => {
  const onClickHandler = () => {
    props.callback();
  };

  return (
    <button onClick={onClickHandler} className={props.className}>
      {props.title}
    </button>
  );
};
