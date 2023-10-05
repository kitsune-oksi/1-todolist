import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";

export const ButtonWithMemo: React.FC<ButtonProps> = React.memo(({ onClick, variant, color, title }) => {
  return (
    <Button onClick={onClick} variant={variant} color={color}>
      {title}
    </Button>
  );
});
