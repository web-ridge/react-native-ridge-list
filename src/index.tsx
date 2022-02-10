import * as React from 'react';
import { useVirtual } from 'react-virtual';
import { FlatListProps, View } from 'react-native';

function FlatList<T>(props: FlatListProps<T>) {
  const {
    ListHeaderComponent,
    ListHeaderComponentStyle,
    ListFooterComponent,
    ListFooterComponentStyle,
    numColumns = 1,
    maxToRenderPerBatch = 20,
    data,
    renderItem,
    getItemLayout,
    onEndReached,
    inverted,
    testID,
  } = props;

  const canFetchMore = false;
  const isFetchingMore = false;
  const parentRef = React.useRef(null);

  const totalSize = (props.data?.length || 0) + 2;
  console.log({ totalSize });
  const virtual = useVirtual({
    horizontal: !!props.horizontal,
    size: totalSize, // +1 if
    parentRef,
    estimateSize: React.useMemo(
      () => {
        return (index: number | undefined) => {
          if (!getItemLayout || !index) {
            return 100;
          }
          return getItemLayout(data as any, index).length;
        };
      },
      // we only want to run estimateSize if data changes & getItemLayout is there
      // eslint-disable-next-line react-hooks/exhaustive-deps
      getItemLayout ? [getItemLayout, data] : [getItemLayout]
    ),
  });

  return (
    <div
      data-testid={testID}
      ref={parentRef}
      style={{
        height: `500px`,
        width: `100%`,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${virtual.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtual.virtualItems.map(({ index, size, start, measureRef }) => {
          const dataIndex = index - 1; // +1 because we have added a header above data
          const isHeader = index === 0;
          const isFooter = totalSize - 1 === index;
          const isItem = !isHeader && !isFooter;
          console.log({
            index,
            dataIndex,
            isHeader,
            isFooter,
            isItem,
            size,
            totalSize,
          });
          return (
            <div
              key={index}
              ref={
                isFooter || isHeader || (isItem && !getItemLayout)
                  ? measureRef
                  : undefined
              }
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: props.horizontal ? size : undefined,
                height: props.horizontal ? undefined : size,
                transform: props.horizontal
                  ? `translateX(${start}px)`
                  : `translateY(${start}px)`,
              }}
            >
              {isHeader
                ? ListHeaderComponent && (
                    <View style={ListHeaderComponentStyle}>
                      {typeof ListHeaderComponent === 'function'
                        ? (ListHeaderComponent as any)()
                        : ListHeaderComponent}
                    </View>
                  )
                : null}
              {isItem && renderItem && data?.[dataIndex]
                ? renderItem({ index, item: data?.[dataIndex] } as any)
                : null}
              {isFooter
                ? ListFooterComponent && (
                    <View style={ListFooterComponentStyle}>
                      {typeof ListFooterComponent === 'function'
                        ? (ListFooterComponent as any)()
                        : ListFooterComponent}
                    </View>
                  )
                : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

export default React.memo(FlatList);
