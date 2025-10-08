## How the Dynamic Chat Layout Works

Here is a detailed breakdown of how the chat interface was built to have a centered text area for new chats and a classic view for ongoing conversations.

### The Core Idea: Conditional Rendering

The entire mechanism is based on a simple principle: **the layout of the page changes based on whether there are any messages in the chat history.**

We use React's state to keep track of the messages. If the message list is empty, we show one layout. If it has any messages, we show a different one. This is called conditional rendering.

--- 

### File 1: `src/app/page.tsx` - The Main Page

This file acts as the "brain" of our chat page. It decides which layout to show and manages the conversation history.

#### 1. Storing Messages in State

First, we use React's `useState` hook to create a place to store our chat messages. We initialize it with an empty array `[]`.

```tsx
// We define what a single message looks like
interface Message {
  text: string;
  sender: 'user' | 'agent';
}

// Then we create the state
const [messages, setMessages] = useState<Message[]>([]);
```

Every time this `messages` array changes (a new message is added), React automatically re-renders the page to show the latest updates.

#### 2. Switching Between Layouts

We use a simple check (`messages.length === 0`) to decide what to render:

```tsx
return (
  <div className="flex flex-col h-screen ...">
    {messages.length === 0 ? (
      // IF TRUE (no messages): Show the centered layout
      <div className="flex-1 flex flex-col items-center justify-center">
        <Logo ... />
        <Textarea onSendMessage={handleSendMessage} />
      </div>
    ) : (
      // IF FALSE (we have messages): Show the classic chat layout
      <>
        <main className="flex-1 ...">...</main>
        <footer className="p-4 ...">...</footer>
      </>
    )}
  </div>
);
```

-   **Empty State Layout**: This is a flex container that centers its children (`Logo` and `Textarea`) both vertically and horizontally.
-   **Chat View Layout**: This uses a flex container with `flex-col` to create a main content area that expands (`flex-1`) and a footer that stays fixed at the bottom.

#### 3. Handling New Messages

When you type a message and hit send, the `handleSendMessage` function is called. This function is responsible for adding your new message to our `messages` state array.

```tsx
const handleSendMessage = (text: string) => {
  // 1. Add the user's new message to the array
  setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);
  
  // 2. Simulate the agent's reply after a short delay
  setTimeout(() => {
    setMessages(prevMessages => [...prevMessages, { text: `Echo: ${text}`, sender: 'agent' }]);
  }, 1000);
};
```

As soon as `setMessages` is called, the `messages` array is no longer empty, and React automatically switches from the centered layout to the classic chat view.

--- 

### File 2: `src/components/chat/Textarea.tsx` - The Input Component

This component was modified to be a self-contained form that can notify the main page when a message is ready to be sent.

#### 1. Receiving the `onSendMessage` Function

We pass the `handleSendMessage` function from `page.tsx` into the `Textarea` component as a prop called `onSendMessage`.

```tsx
// In Textarea.tsx
interface TextareaProps {
    onSendMessage: (message: string) => void;
}
```

#### 2. Handling Form Submission

The component is wrapped in a `<form>` tag. When the form is submitted (either by clicking the button or pressing Enter), the `handleSubmit` function is called.

```tsx
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from reloading
    if (value.trim()) { // Make sure the message isn't empty
        onSendMessage(value.trim()); // Call the function from the main page
        setValue(''); // Clear the textarea
    }
};
```

This is how the `Textarea` tells the main page, "Hey, the user just sent this message!" The main page then takes over, updates the state, and the UI changes as a result.

--- 

### File 3: Displaying the Chat Messages

Once we have messages in our state array, displaying them is straightforward. In the "Chat View Layout" of `page.tsx`, we use the `.map()` method to loop over the `messages` array and render a `div` for each one.

```tsx
{messages.map((msg, index) => (
  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`p-3 rounded-lg ... ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
      {msg.text}
    </div>
  </div>
))}
```

We use conditional styling to change the background color and alignment of the message bubble depending on whether the `sender` is the `'user'` or the `'agent'`.
