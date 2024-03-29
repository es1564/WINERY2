import { observer } from "mobx-react-lite"

import React, { FC, Fragment, useEffect, useMemo, useState } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { Button, Card, EmptyState, Icon, Screen, Text, Toggle } from "../components"

import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { Episode } from "../models/Episode"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
// import { openLinkInBrowser } from "../utils/open-link-in-browser"
import * as RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlite-storage';
import { WineList } from "../models/WineList"

//const db = SQLite.openDatabase('WINERY2DB.db');

const db = SQLite.openDatabase(
  {
      name: 'Winery.db',
      location: 'default',
      createFromLocation: 1,
    },
    () => {
      console.log('db connect success');
    },
    (error) => {
      console.log('db connect error', error);
    }
  );

const ICON_SIZE = 14

const rnrImage1 = require("../../assets/images/josswine.png")
const rnrImage2 = require("../../assets/images/josswine.png")
const rnrImage3 = require("../../assets/images/josswine.png")
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]

export const WineListScreen: FC<DemoTabScreenProps<"WineList">> = observer(
  function WineListScreen(_props) {

  const { episodeStore } = useStores()
  const { wineListStore } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [wineList, setWineList] = React.useState()

  const fetch = require('node-fetch');

const encodedParams = new URLSearchParams();
encodedParams.append("url", "https://storage.googleapis.com/api4ai-static/samples/wine-1.jpg");

const url = 'https://wine-recognition2.p.rapidapi.com/v1/results?n=10';

const options = {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
    'X-RapidAPI-Host': 'wine-recognition2.p.rapidapi.com'
  },
  body: encodedParams
};

fetch(url, options)
	.then(res => res.json())
	.then(json => console.log(json))
	.catch(err => console.error('error:' + err));

  
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await testFile()
      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await wineListStore.fetchWineLists()
      setIsLoading(false)
    })()
  }, [wineListStore])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([wineListStore.fetchWineLists(), delay(750)])
    setRefreshing(false)
  }


  const [content, setContent] = useState(null);

  const testFile = () => {

    db.transaction((tx) => {
      // tx.executeSql('SELECT * FROM RT_WINE_INFO_202112 WHERE WINE_ID < 10', [], (tx, results) => {
      tx.executeSql('SELECT * FROM wine_list WHERE WINE_ID < 10', [], (tx, res) => {
          const rows = res.rows;
          let users = [];
          for (let i=0; i<rows.length; i++) {
            //console.log(rows.item(i));
          }
          
          var len = res.rows.length;
          var data = [];
          for (let i = 0; i < len; i++) {
            // console.log('mylength: ' + res.rows.item(i).WINE_ID);
            // console.log(res.rows.item(i))
            // data.push({res.rows.item(i)})
            data.push(res.rows.item(i));
          }
          //this.setState({dataSource: [...this.state.dataSource, ...data]});
          // console.log(data)
          // setWineList(data)

        }, (error) => {
          console.log(' failed - ' + error);
      });

    })

  }



  // const renderItem = ({ item, index }) => (
  //   <TouchableOpacity
  //     key={index + item.title + item.chDt}
  //     // onPress={throttle(() => {
  //     //   onClickItem(item.bbsSeq);
  //     // })}
  //   >
  //     <Card
  //       style={{flex:1}}
  //       verticalAlignment="force-footer-bottom"
  //       HeadingComponent={
  //         <View style={$metadata}>
  //           <Text
  //             style={$metadataText}
  //             size="xxs"
  //             // accessibilityLabel={episode.datePublished.accessibilityLabel}
  //           >
  //             {item.WINE_CTGRY}
  //           </Text>
  //         </View>
  //       }

  //       content={item.WINE_NM}
  //       // content={`${episode.parsedTitleAndSubtitle.title} - ${episode.parsedTitleAndSubtitle.subtitle}`}
  //       {...accessibilityHintProps}
  //       RightComponent={<Image source={rnrImage1} style={$itemThumbnail} />}
  //       FooterComponent={
  //         <Button>123</Button>
  //         // <Button
  //         //   onPress={handlePressFavorite}
  //         //   onLongPress={handlePressFavorite}
  //         //   style={[$favoriteButton, isFavorite && $unFavoriteButton]}
  //         //   accessibilityLabel={
  //         //     isFavorite
  //         //       ? translate("wineListScreen.accessibility.unfavoriteIcon")
  //         //       : translate("wineListScreen.accessibility.favoriteIcon")
  //         //   }
  //         //   LeftAccessory={ButtonLeftAccessory}
  //         // >
  //         //   <Text
  //         //     size="xxs"
  //         //     accessibilityLabel={episode.duration.accessibilityLabel}
  //         //     weight="medium"
  //         //     text={
  //         //       isFavorite
  //         //         ? translate("wineListScreen.unfavoriteButton")
  //         //         : translate("wineListScreen.favoriteButton")
  //         //     }
  //         //   />
  //         // </Button>
  //       }
  //     />
  //   </TouchableOpacity>



  // );

  
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <View>
        <Button
          testID="login-button"
          preset="reversed"
          onPress={testFile}
        >db test
        </Button>
      </View>

      {/* <FlatList
        data={wineList}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      /> */}






      <FlatList<WineList>
        // data={wineList}
        data={wineListStore.wineListsForList}
        extraData={wineListStore.favorites.length + wineListStore.wineLists.length}
        contentContainerStyle={$flatListContentContainer}
        refreshing={refreshing}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                wineListStore.favoritesOnly
                  ? "wineListScreen.noFavoritesEmptyState.heading"
                  : undefined
              }
              contentTx={
                wineListStore.favoritesOnly
                  ? "wineListScreen.noFavoritesEmptyState.content"
                  : undefined
              }
              button={wineListStore.favoritesOnly ? null : undefined}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="wineListScreen.title" />
            {/* {(wineListStore.favoritesOnly || wineListStore.wineListsForList.length > 0) && ( */}
            {(true) && (
              <View style={$toggle}>
                <Toggle
                  value={wineListStore.favoritesOnly}
                  onValueChange={() =>
                    wineListStore.setProp("favoritesOnly", !wineListStore.favoritesOnly)
                  }
                  variant="switch"
                  label="wineListScreen.onlyFavorites"
                  labelPosition="left"
                  labelStyle={$labelStyle}
                  accessibilityLabel={translate("wineListScreen.accessibility.switch")}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <WineListCard
            key={item.WINE_ID}
            wineList={item}
            isFavorite={wineListStore.hasFavorite(item)}
            onPressFavorite={() => wineListStore.toggleFavorite(item)}
          />
        )}
      />


    </Screen>
  )
})



const WineListCard = observer(function WineListCard({
  wineList,
  isFavorite,
  onPressFavorite,
}: {
  wineList: WineList
  onPressFavorite: () => void
  isFavorite: boolean
}) {
  const liked = useSharedValue(isFavorite ? 1 : 0)

  const imageUri = useMemo(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)]
  }, [])

  // Grey heart
  const animatedLikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    }
  })

  // Pink heart
  const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    }
  })

  /**
   * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
   * @see https://reactnative.dev/docs/accessibility#accessibilityactions
   */
  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityHint: translate("wineListScreen.accessibility.cardHint", {
            action: isFavorite ? "unfavorite" : "favorite",
          }),
        },
        android: {
          accessibilityLabel: wineList.title,
          accessibilityActions: [
            {
              name: "longpress",
              label: translate("wineListScreen.accessibility.favoriteAction"),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === "longpress") {
              handlePressFavorite()
            }
          },
        },
      }),
    [wineList, isFavorite],
  )

  const handlePressFavorite = () => {
    onPressFavorite()
    liked.value = withSpring(liked.value ? 0 : 1)
  }

  const handlePressCard = () => {
    console.log('handlePressCardhandlePressCard')
    // openLinkInBrowser(wineList.enclosure.link)
  }

  const ButtonLeftAccessory = useMemo(
    () =>
      function ButtonLeftAccessory() {
        return (
          <View>
            <Animated.View
              style={[$iconContainer, StyleSheet.absoluteFill, animatedLikeButtonStyles]}
            >
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.neutral800} // dark grey
              />
            </Animated.View>
            <Animated.View style={[$iconContainer, animatedUnlikeButtonStyles]}>
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.primary400} // pink
              />
            </Animated.View>
          </View>
        )
      },
    [],
  )

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      onLongPress={handlePressFavorite}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
            // accessibilityLabel={wineList.datePublished.accessibilityLabel}
          >
            {wineList.WINE_CTGRY}
            {/* {wineList.datePublished.textLabel} */}
          </Text>
          <Text
            style={$metadataText}
            size="xxs"
            // accessibilityLabel={wineList.duration.accessibilityLabel}
          >
            {wineList.WINE_PRC}
            {/* {wineList.duration.textLabel} */}
          </Text>
        </View>
      }
      content={
        <View>
          <Text>{wineList.WINE_NM}</Text>
          <Text>------</Text>
          <Text>{wineList.WINE_AREA_NM}</Text>
        </View>
      }
      // content={wineList.WINE_NM}
      // content={`${wineList.parsedTitleAndSubtitle.title} - ${wineList.parsedTitleAndSubtitle.subtitle}`}
      {...accessibilityHintProps}
      RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
      FooterComponent={
        <Button
          onPress={handlePressFavorite}
          onLongPress={handlePressFavorite}
          style={[$favoriteButton, isFavorite && $unFavoriteButton]}
          accessibilityLabel={
            isFavorite
              ? translate("wineListScreen.accessibility.unfavoriteIcon")
              : translate("wineListScreen.accessibility.favoriteIcon")
          }
          LeftAccessory={ButtonLeftAccessory}
        >
          <Text
            size="xxs"
            // accessibilityLabel={wineList.duration.accessibilityLabel}
            weight="medium"
            text={
              isFavorite
                ? translate("wineListScreen.unfavoriteButton")
                : translate("wineListScreen.favoriteButton")
            }
          />
        </Button>
      }
    />
  )
})




// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
}

const $item: ViewStyle = {
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $toggle: ViewStyle = {
  marginTop: spacing.medium,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginRight: spacing.small,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.extraSmall,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginRight: spacing.medium,
  marginBottom: spacing.extraSmall,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.medium,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.medium,
  paddingTop: spacing.micro,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
}

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion

// @demo remove-file
