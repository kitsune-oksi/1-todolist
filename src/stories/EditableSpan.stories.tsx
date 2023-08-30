import type { Meta, StoryObj } from '@storybook/react';
import {EditableSpan} from "../components/EditableSpan/EditableSpan";
import {Provider} from "react-redux";
import { store } from '../store/store';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const meta: Meta<typeof EditableSpan> = {
  title: 'TODOLISTS/EditableSpan',
  component: EditableSpan,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const EditableSpanStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  render: () => <Provider store={store}><EditableSpan value={'test'} todolistId={'dfgfdgdf'} disabled={false}/></Provider>
}