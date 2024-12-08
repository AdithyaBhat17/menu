### Menu component

**Problem: Build a multilevel menu component**

The component takes a url that when passed, async fetches the options on
opening of the menu. Once data is fetched, it renders as options in the menu. The
menu also has a search box wherein search can be done either on the url or
internally with the available list of options (this is configurable and by default it is internal search).  
When an option is chosen, the item has to be highlighted denoting the selected
state.  
When hovered on a nested menu parent item, the nested option should show up
adjacent to it. The same behavior of the parent menu is applicable even to child
list. And the nested behavior should go on forever for all child items till the item
has a child list or url in its data.  
Remember this will be a reusable component, and therefore should be built in
such a way that we can make use of it with different url on the same page in
different places of the UI.

### Solution

You can find a working demo at https://menu-demo.adithyabhat.com.

A detailed explanation of how the UI component works can be found [here](/menu-client/README.md)

If you want to try this on your local environment, follow the instructions below.

### Setup

- Setup the API server using the instructions at [api-server-setup](/menu-server/README.md)
- Setup the client using the instructions at [client-setup](/menu-client/README.md)
