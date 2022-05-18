import * as React from 'react';
import { FlatListProps, StyleSheet } from 'react-native';
import {
  Virtuoso,
  GroupedVirtuoso,
  Components,
  VirtuosoProps,
} from 'react-virtuoso';

const notImplementedFunc = () =>
  console.warn('[react-native-ridge-list] not implemented');

const separators = {
  highlight: notImplementedFunc,
  unhighlight: notImplementedFunc,
  updateProps: notImplementedFunc,
};

export default function FlatList<T>(props: FlatListProps<T>) {
  // const outerRef = React.useRef<HTMLDivElement | undefined>(undefined);
  const startReachedTriggered = React.useRef(false);
  const {
    // numColumns = 1,
    // maxToRenderPerBatch = 20,
    data,
    renderItem,
    // getItemLayout,
    onEndReached,
    inverted,
    // testID,
    ListHeaderComponent,
    // ListHeaderComponentStyle,
    ListFooterComponent,
    style,
    stickyHeaderIndices,
  } = props;

  // const onEndReachedThreshold: number = props.onEndReachedThreshold || 15;

  const components: Components<any> = {
    Header: ListHeaderComponent as any,
    Footer: ListFooterComponent as any,
    // Header: ListHeaderComponent || undefined,
  };

  const webStyle = React.useMemo(() => StyleSheet.flatten(style), [style]);
  // const [initialIndex] = React.useState(data ? data.length - 1 : 0);
  const endReached = onEndReached
    ? () => onEndReached({ distanceFromEnd: 0 })
    : undefined;

  // React.useEffect(() => {
  //   return () => {
  //     console.log('unmount');
  //   };
  // }, []);
  //
  const prevLength = React.useRef(data?.length || 0);
  //
  const currentLength = data?.length || 0;
  const firstItemIndex = React.useMemo(() => {
    const added = currentLength - prevLength.current;
    // const newIndex = added - prevLength.current;
    // const newIndex = currentLength + added;
    prevLength.current = currentLength;
    console.log({ added });
    return added;
  }, [currentLength]);
  // let newIndex = 0;
  // if (startReachedTriggered.current) {
  //   newIndex = prevLength.current;
  //   startReachedTriggered.current = false;
  // } else {
  // newIndex = currentLength - prevLength.current;

  // }
  //   //
  //   // console.log({
  //   //   startReachedTriggered: startReachedTriggered.current,
  //   //   newIndex,
  //   // });
  //   const itemsAdded = currentLength - prevLength.current;
  //   console.log({ itemsAdded, currentLength, prevLength: prevLength.current });
  //   const n = Math.max(
  //     (startReachedTriggered.current
  //       ? prevLength.current
  //       : currentLength - prevLength.current,
  //     0)
  //   );
  //   // console.log({ n, currentLength, prev: prevLength.current });
  //
  //   return n;
  // }, [currentLength]);
  // React.useEffect(() => {
  //   prevLength.current = currentLength;
  // }, [currentLength]);

  // const prependItems = useCallback(() => {
  //   const usersToPrepend = 20;
  //   const nextFirstItemIndex = firstItemIndex - usersToPrepend;
  //
  //   setTimeout(() => {
  //     setFirstItemIndex(() => nextFirstItemIndex);
  //     setUsers(() => [
  //       ...generateUsers(usersToPrepend, nextFirstItemIndex),
  //       ...users,
  //     ]);
  //   }, 500);
  //
  //   return false;
  // }, [firstItemIndex, users, setUsers]);
  console.log({ dataLength: data?.length, data });
  let basicProps: VirtuosoProps<T, any> = {
    style: webStyle as any,
    data: data || undefined,
    components,
  };

  if (inverted) {
    // basicProps.data = [...(basicProps?.data || [])]?.reverse();
    basicProps = {
      ...basicProps,
      startReached: () => {
        console.log('startReached');
        startReachedTriggered.current = true;
        endReached?.();
      },
      firstItemIndex: firstItemIndex,
      initialTopMostItemIndex: data ? data?.length - 1 : 0,
    };
  } else {
    basicProps = {
      ...basicProps,
      endReached,
    };
  }

  if (stickyHeaderIndices) {
    return (
      <GroupedVirtuoso
        {...{
          ...basicProps,
          groupCounts: stickyHeaderIndices,
          groupContent: (index) => {
            const item = data?.[index];
            return renderItem?.({ item: item!, index, separators });
          },
          itemContent: (index, _groupIndex) => {
            const item = data?.[index];
            return renderItem?.({ item: item!, index, separators });
          },
        }}
      />
    );
  }

  // basic
  return (
    <Virtuoso
      {...{
        ...basicProps,
        itemContent: (index) => {
          const item = data?.[index];
          return renderItem?.({ item: item!, index, separators });
        },
      }}
    />
  );
}
//
// function usePrevious<T>(value: T): MutableRefObject<T | undefined> {
//   const ref = React.useRef<T>();
//
//   React.useEffect(() => {
//     console.log('set new', value);
//     ref.current = value;
//   }, [value]);
//
//   return ref;
// }
