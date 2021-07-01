import * as React from 'react';
import { View } from 'react-native';
import { FlatListProps, StyleSheet } from 'react-native';
import InfiniteLoader from 'react-window-infinite-loader';
import { VariableSizeList, VariableSizeGrid } from 'react-window';

const outerElementTypeWithTestId = (testID: string | undefined) =>
  React.forwardRef((props, ref) => (
    // @ts-ignore
    <div ref={ref} data-testid={testID} {...props} />
  ));

export default function FlatList<T>(props: FlatListProps<T>) {
  const outerRef = React.useRef<HTMLDivElement | undefined>(undefined);
  const {
    ListHeaderComponent,
    ListHeaderComponentStyle,
    numColumns = 1,
    maxToRenderPerBatch = 20,
    data,
    renderItem,
    getItemLayout,
    onEndReached,
    inverted,
    testID,
  } = props;

  const onEndReachedThreshold: number = props.onEndReachedThreshold || 15;

  if (!getItemLayout) {
    throw Error('getItemLayout is required with react-native-ridge');
  }

  const [layout, setLayout] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    if (!inverted) {
      return;
    }
    const listener = (e: WheelEvent) => {
      e.preventDefault();

      if (outerRef.current) {
        // only supported in safari but maybe added in the future
        let reverse =
          (e as any).directionInvertedFromDevice ||
          (e as any).webkitDirectionInvertedFromDevice ||
          (e as any).directionInvertedFromDevice;

        // fallback on default settings
        if (reverse === undefined) {
          reverse = navigator.platform.indexOf('Mac') > -1;
        }

        if (outerRef) {
          if (reverse) {
            outerRef.current.scrollTop -= e.deltaY;
          } else {
            outerRef.current.scrollTop += e.deltaY;
          }
        }
      }

      return false;
    };
    // const scrollListener = (e: Event) => {
    //   e.preventDefault();
    //
    //   return false;
    // };
    window.addEventListener('wheel', listener, { passive: false });
    // window.addEventListener('scroll', scrollListener, { passive: false });
    return () => {
      window.removeEventListener('wheel', listener);
      // window.removeEventListener('scroll', scrollListener);
    };
  }, [inverted]);
  const Grid = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex + columnIndex;
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <div style={inverted ? { ...style, transform: 'scale(-1)' } : style}>
        {data && data.length > 0 && renderItem
          ? renderItem({ index, item: data && data[index] } as any)
          : null}
      </div>
    );
  };

  const Row = ({ index, style }: any) => (
    // eslint-disable-next-line react-native/no-inline-styles
    <div style={inverted ? { ...style, transform: 'scale(-1)' } : style}>
      {index === 0
        ? ListHeaderComponent && (
            <View style={ListHeaderComponentStyle}>
              {typeof ListHeaderComponent === 'function'
                ? (ListHeaderComponent as any)()
                : ListHeaderComponent}
            </View>
          )
        : null}
      {data && data.length > 0 && renderItem
        ? renderItem({ index, item: data && data[index] } as any)
        : null}
    </div>
  );

  const getItemSize = (index: number) => {
    const layoutHeight = getItemLayout(data as any, index).length;
    if (index === 0 && (ListHeaderComponent || ListHeaderComponentStyle)) {
      if (ListHeaderComponentStyle) {
        const {
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          height,
        } = StyleSheet.flatten(ListHeaderComponentStyle);
        return (
          layoutHeight +
          (Number(marginTop) || 0) +
          (Number(marginBottom) || 0) +
          (Number(paddingTop) || 0) +
          (Number(paddingBottom) || 0) +
          (Number(height) || 0)
        );
      }
      // to add support for header
      if (ListHeaderComponent) {
        return layoutHeight * 2;
      }
    }
    return layoutHeight;
  };
  const getItemWidth = (_: number) => {
    return layout.width / numColumns;
  };
  const itemCount = data && data.length > 0 ? data.length : 1; // to add support for header

  const isItemLoaded = (index: number) => index < itemCount;

  const onLoadMore = React.useCallback(
    (startIndex: number, stopIndex: number) => {
      const total = getItemLayout(data as any, (data as any).length - 1);
      const totalHeight = total.offset + total.length;
      const offset = getItemLayout(data as any, stopIndex).offset;
      onEndReached &&
        onEndReached({
          distanceFromEnd: totalHeight - offset,
        });
      return null;
    },
    [data, getItemLayout, onEndReached],
  );

  const outerElementType = React.useMemo(
    () => outerElementTypeWithTestId(testID),
    [testID],
  );

  let inner;
  if (numColumns > 1) {
    inner = (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount + maxToRenderPerBatch}
        loadMoreItems={onLoadMore}
        minimumBatchSize={maxToRenderPerBatch}
        threshold={onEndReachedThreshold}
      >
        {({ onItemsRendered, ref }) => (
          <VariableSizeGrid
            ref={ref}
            outerRef={outerRef}
            outerElementType={outerElementType}
            onItemsRendered={onItemsRendered as any}
            width={layout.width}
            height={layout.height}
            columnCount={numColumns}
            rowHeight={getItemSize}
            columnWidth={getItemWidth}
            rowCount={Math.ceil(itemCount / numColumns)}
          >
            {Grid}
          </VariableSizeGrid>
        )}
      </InfiniteLoader>
    );
  } else {
    inner = (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount + maxToRenderPerBatch}
        loadMoreItems={onLoadMore}
        minimumBatchSize={maxToRenderPerBatch}
        threshold={onEndReachedThreshold}
      >
        {({ onItemsRendered, ref }) => (
          <VariableSizeList
            ref={ref}
            outerRef={outerRef}
            outerElementType={outerElementType}
            onItemsRendered={onItemsRendered}
            width={layout.width}
            height={layout.height}
            itemSize={getItemSize}
            itemCount={itemCount}
          >
            {Row}
          </VariableSizeList>
        )}
      </InfiniteLoader>
    );
  }

  const onLayout = React.useCallback(
    ({
      nativeEvent: {
        layout: { width, height },
      },
    }) => {
      setLayout({ width, height });
    },
    [setLayout],
  );

  return (
    <View
      onLayout={onLayout}
      style={[props.style, inverted && { transform: [{ scale: -1 }] }]}
    >
      {layout.width > 0 && layout.height > 0 ? inner : null}
    </View>
  );
}
