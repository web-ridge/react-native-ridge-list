# react-native-ridge-list
FlatList abstraction which uses react-window on the web to create better list performance


## Caveats
- you are required to provide the getItemLayout
- inverted FlatList always reverse scroll on Mac devices but don't understand other scroll behaviours in browsers other than Safari
    - https://bugs.chromium.org/p/chromium/issues/detail?id=156551
    - https://github.com/w3c/uievents/issues/57
