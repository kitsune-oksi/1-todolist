import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton, TextField } from "@mui/material";

type Props = {
  addItem: (title: string) => void;
  disabled?: boolean;
};

export const AddItemForm: React.FC<Props> = React.memo(({ addItem, disabled }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItemHandler = useCallback(() => {
    const newTitle = title.trim();
    if (newTitle) {
      addItem(title);
      setTitle("");
    } else {
      setError("Title is required!");
    }
  }, [title, setTitle]);

  const setTitleHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value),
    [setTitle],
  );

  const onKeyPressHandler = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        addItemHandler();
      }
      if (error) {
        setError(null);
      }
    },
    [error, addItemHandler, setError],
  );

  return (
    <div>
      <TextField
        variant={"standard"}
        value={title}
        onChange={setTitleHandler}
        onKeyDown={onKeyPressHandler}
        error={!!error}
        label={"Title"}
        helperText={error}
      />
      <IconButton color="primary" aria-label="add a task" onClick={addItemHandler} disabled={disabled}>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
});
