# react-native-ridge-list
FlatList abstraction which uses [bvaughn/react-window](https://github.com/bvaughn/react-window) on the web to create better list performance

## Supported props
- ListHeaderComponent (you have to provide height in the ListHeaderComponentStyle, it understands height + marginTop, marginBottom etc.
- ListHeaderComponentStyle
- numColumns = 1
- maxToRenderPerBatch = 20
- data
- renderItem
- getItemLayout
- onEndReached
- inverted
- testID


## Caveats
- you are required to provide the getItemLayout
- inverted FlatList always reverse scroll on Mac devices but don't understand other scroll behaviours in browsers other than Safari
    - https://bugs.chromium.org/p/chromium/issues/detail?id=156551
    - https://github.com/w3c/uievents/issues/57
