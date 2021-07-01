
# react-native-ridge-list
FlatList abstraction which uses [bvaughn/react-window](https://github.com/bvaughn/react-window) on the web to create better list performance

## Supported props
- ListHeaderComponent (you have to provide height in the ListHeaderComponentStyle, it understands height + marginTop, marginBottom etc.
- ListHeaderComponentStyle
- numColumns 
- maxToRenderPerBatch
- data
- renderItem
- getItemLayout
- onEndReached
- inverted
- testID


## Caveats
- you are required to provide the getItemLayout
- inverted FlatList always reverse scroll on Mac devices but don't understand other scroll behaviours in browsers other than Safari, because we can only detect this in Safari.
    - https://bugs.chromium.org/p/chromium/issues/detail?id=156551
    - https://github.com/w3c/uievents/issues/57
## Installation
```sh
yarn add react-native-ridge-list
```
or
```sh
npm install react-native-ridge-list
```


## Usage

```js
import RidgeList from "react-native-ridge-list";

const ITEM_HEIGHT = 65

function getDefaultItemLayout(
  data,
  index,
) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

// ...

<RidgeList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        getItemLayout={getDefaultItemLayout}
      />
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
