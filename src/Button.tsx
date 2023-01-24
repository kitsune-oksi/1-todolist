type ButtonProps = {
    title: string
    callback: () => void
}

export const Button = (props: ButtonProps) => {
    const onClickHandler = () => {
        props.callback()
    }

    return (
        <button onClick={onClickHandler}>{props.title}</button>
    )
}