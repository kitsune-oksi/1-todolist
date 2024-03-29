import type { Meta, StoryObj } from "@storybook/react";
import { ERequestStatus, ETaskPriorities, ETaskStatuses } from "common/enums";
import { Task } from "features/Todolists/Todolist/Tasks/Task/Task";
import { ReduxStoreProviderDecorator } from "./decorators/ReduxStoreProviderDecorator";

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
      status: ETaskStatuses.New,
      todoListId: "todolistId1",
      order: 0,
      priority: ETaskPriorities.Low,
      addedDate: "",
      deadline: "",
      startDate: "",
      description: "",
      entityStatus: ERequestStatus.idle,
    },
  },
};
