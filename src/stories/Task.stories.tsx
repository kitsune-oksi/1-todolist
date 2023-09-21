import type { Meta, StoryObj } from "@storybook/react";
import { TaskPriorities, TaskStatuses } from "api/todolist-api";
import { Task } from "features/Todolists/Task/Task";
import { ReduxStoreProviderDecorator } from "./decorators/ReduxStoreProviderDecorator";
import { ERequestStatus } from "../store/app-reducer";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const meta: Meta<typeof Task> = {
  title: "TODOLISTS/Task",
  component: Task,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    task: { id: "12wsdewfijdei", title: "JS", isDone: false },
    // @ts-ignore
    todolistId: "fgdosrg8rgjuh",
  },
  decorators: [ReduxStoreProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const TaskStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    task: {
      id: "12wsdewfijdei2343",
      title: "CSS",
      status: TaskStatuses.New,
      todoListId: "todolistId1",
      order: 0,
      priority: TaskPriorities.Low,
      addedDate: "",
      deadline: "",
      startDate: "",
      description: "",
      entityStatus: ERequestStatus.idle,
    },
  },
};
