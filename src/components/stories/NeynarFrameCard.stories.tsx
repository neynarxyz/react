import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import NeynarFrameCard, { NeynarFrameCardProps } from "../organisms/NeynarFrameCard";
import FrameCard, { FrameCardProps } from "../molecules/FrameCard";

const meta: Meta<typeof NeynarFrameCard> = {
  title: "NeynarFrameCard",
  component: NeynarFrameCard,
};

export default meta;

const Template: StoryFn<FrameCardProps> = (args) => (
  <div style={{ maxWidth: "40vw" }}>
    <FrameCard {...args} />
  </div>
);

const TemplateWithInteractions: StoryFn<NeynarFrameCardProps> = (args) => (
  <div style={{ maxWidth: "40vw" }}>
    <NeynarFrameCard {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  hash: "0xd337840c939af1dd0390ec990bfac21edff540d0",
  frames: [
    {
      version: "vNext",
      title: "Introducing Smart Wallets on Paragraph",
      image: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/highlight?text=Introducing%20Smart%20Wallets%20on%20Paragraph&author=Paragraph&url=%40blog&avatarUrl=https%3A%2F%2Fstorage.googleapis.com%2Fpapyrus_images%2Fd925b3511c5e20563b83a09cbe30bbf5&featuredImageUrl=https%3A%2F%2Fstorage.googleapis.com%2Fpapyrus_images%2F9a1a388602fbbf0be39a32259b167c84.jpg&size=2048",
      buttons: [
        {
          index: 1,
          title: "Open",
          action_type: "post_redirect",
          post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/open/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb",
        },
        {
          index: 2,
          title: "Read Inline",
          action_type: "post",
          post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/read/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb/0",
        },
        {
          index: 3,
          title: "Subscribe 🔔",
          action_type: "post",
          post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/subscribe/BMV6abfvCSUl51ErCVzd/3T2PQZlsdQtigUp4fhlb",
        },
        {
          index: 4,
          title: "Mint",
          action_type: "post",
          target: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/mint-buttons/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb",
        },
      ],
      input: {},
      state: {},
      frames_url: "https://paragraph.xyz/@blog/introducing-smart-wallets",
    },
  ],
};

Primary.argTypes = {
  hash: { table: { disable: true } },
  frames: { table: { disable: true } },
};

export const SliceFrame = TemplateWithInteractions.bind({});
SliceFrame.args = {
  url: "https://shop.slice.so/store/0?productId=12",
  initialFrame: {
    "version": "vNext",
    "title": "Mfers Blue Hat",
    "image": "https://slice.so/frames/slicer/869/product/1/image?image=N4IgLghg5iBcIBMCWA3EAaEAHATgeywGc5RCwBPAGwFMTElCtKJy4QAzGgDww%252B4BEkOagGMwSPADs2IvJQCuAW2mYAFtSRRVYNgEYADPoCkvAO5IEYVXsMmAvphGqklBMOmxQuAsU8gGAPIAwgDKcGA48tSYZHjCAHIQirTwALLs1DjEmN4I8mJ0FnC6AJwAbABMmJJJKSDpmYQABABCCtRNABIQOjGqcWD81IQiOEhY4lJsvEiK0MNwANog2mBEsAD0G1AolEiSptTUquymAF4IIghcANY3EJIAdITyWBAARhCE1I%252ByG7E4eYbFC6DZ4d4AK1EYA2WHk7z2In%252BiMyAFpZvNCBsABxlEqw-B5MRYhpZbpgNpRLCSKAAfUBujAinOijwj2pMAAuphApJCEgwCl2BBKN8eYQhnsUJlWLAIlFMNQuIKcDVKAAFQn5MC%252BRagIqwXS6bEAFhy%252BBQFkybEIKNRuJKvG8loQmU1eCJYAAkgg4JJ5JRKOa8C7MgA1CBjB5gRLJP0BoPYC1WnARqOSHVLTl2bkgEWUPCHBAAQQQbmG311uZE8hw7hEspA%252Bi42IAzK2AKzYkrsK5lagId79-TY9gmkQAdhErYqCBN7AnuneHZN7wQEH0FRKulbTrGIjqFQ7hhP%252BhmhAAqiF%252BHBhaLoiAlSq1aXy4RfE2uKfvz-f3--2eirKkE6giDcr7CO%252BbDNiUrYmiaFSttQFS6B2SHsMuHYiBAFQThOEATtiFTvOOE7vJOCD4WUIgmnhvBPiBog3CEmjQV%252Bv70cqABK1DMOI0qakgB7hJED6fN8gnCfAR4-ueXqSOw%252BwCik8oPhAKAQC4Hw0BekgCr4%252BiYHMXC6fp6qZC08jkNasCGSAwgZHWIoAGJHO6npwHZLzvO52qEJJdRnnYDggE4Ljlh4iy5gwACiIwQFgA4iVEwWOM4rjuEsoCQDA8DIGgwZEHQZBUCkoDmJY1jwAYxi8OomjaDYtWYMgjDMI2nBKrwELyGQSDsOQQRSIKGYyNQGbWpgIqaJIXqCooH4HhNOC8J1XCCMIYgSB4oVyEoKi7QWK3wAAxM5rbnedTp4Pykw7cIfGoLQmDsMNADqGhaDosAmoYL3Dc5SQuI2Q37OJtAhWFGXjVl4DQGwswwIVvikBQNB0K1TAsGwa3Xbd21sB8hB7YKvDglCYjOQKMghpNIAVVYbBoSYaifY11W2CAIWEDgIhsKs6xbLaQk-MTGwiO8tLsICyS0p8YFQPg8iSAgtLiGANDsjSvAit9IBSE4mmSE0LyKMkOBNPLNyK3gyu%252BpD6URVm4pxdhiW%252BnKokOP6gboNl8N5age4%252BMVaNlfQbXY-AuMvQIQjQgT8CyAoyg63sUCzfNi3jSqdVs3rNX2Gl4WZbAepw7l9AFUmId%252BCV6N%252BJj7U49w3W9eIA1DRNo1JzndPTRnc3UAtY3LWYFiMxzzUrPnTVF6Fjul-7leI8HRV12HdDk9CVN67I0orZgDNVSA7YszPDV62U0-vHEro4FxEDIL1bAVPoWA8NzvP82AayEJs2xdj7EOMcU4Fwri3HuE8F4bxwa-DwP8MAcQgQgjBJCaEsJ4SImRCLHA6I5hQGGDiPEBIPR%252BQ2KSQg5JKTUA5PSCAjJmRnFZFrJGeZKB61yNqJoGJCFc2LtDSK0VCCuwSklT2KUHYlxhmXZeCNFBsO8OvVGpUt7oMptTJOtND70wnifM%252BedL5sGvufW%252BOB76P2fh%252BN%252BH9%252BEgB5nzeAAt-5bB2HsA4RwTjnEuNcO4DxnivA%252BF8H4fwAQoNBNvMQmCERCRwQePBvCiEOlIZ6EkjkqE9BoXQhkTIWRsg5GnThWoxA8IIRDARTsy7CNEe7ZK1Acwu3irUiR9S-YVzYPlNeKN7Gb0bgwLGHVW45BugKROeZ3jEwUKTI%252BeimYVEeJ2UxeBf54EUGwVEJoyi2JyE-ZA2t4CbI-k0VsWyeA7LLPsKALRllILWfACc78zkgB6n1Tuw0c42jeAeVE7xqBgBAQdAemdh7ZzHpgQUyoAAqgI%252BSvRwHckArxEq82CatAGQNKAgzwGDYJqQpB4DsVDSpcjA7VyUd0%252Bu4cm5Rz4F1WOSoNoJymFolOB1j5z0JYvGR5ccodKDsjUOqi%252BmR0GXS9hM0h4j17mCkAUAEpsGxLYqRgjYa8tJV0wVDdQDUtFU8oFkrQW50wFbG2dshpHTYGdZy2J%252BBBGcrwMxFin5IBflPc%252B7LqoVG2RfL6egvWf2VZUqKjS3biNUg4El2ANUbyFaAV6GYPpGNgA8uy8awAsTOHUXQJpvVzBwFAfYnkWr9ObvABEeAwKcukTtShVaVVl3qOkkA1Smlhq9tmCppceUByrtGlRWqI4DJbmK-VWdR5GpACapWKtzVxEtc5a1tr7XGrvpkSxLqPyF3HpVP13r6q%252Bs9UqwNXaW2ho9uGtpaqo0CpjQOtNiaD0pv%252BhmDNWac1PLzQWjwdkdVsHLZW49MjG2NDrUG4DWRm0hrEee9tUHmkXsjZ0m9-aqUlppTHcVg8x3SonS8jug13k93sV86gPy-kAu3ZPEAW7AORUjVgPtPTY0cGGq%252B1%252BjzeDGTerM%252B5HZz6fsLQco5%252BgmgicAoO0tk6CwAc7UByhrR2hdB6KBrt4Hmg0KUzoU90G6kRvafABjyGmN3tY0gTNr9-WccjF%252BzytHX4diaFeW1KnuUgCPI568QRIP%252BBEa2mDKUO0L2raqnthma7KOM%252BHNNbHpIcaMhALg3Gd28f49ZwTIB32iay%252BJ39ZbpM3BczW9JCmoiacK0sNTJWOjkm87FPzunL2hcY5Sug0WzOHks-F-Ngn9B2ekg5pzXm%252BvLHc4N2rvmz26e0-B9tw3EP8vCxS3p2q0O6rThK7DoU%252B46LlQx%252BAirP6ybo-p3tRmWvCqHdHIZmHgVSq2zKqdtsZ1yDnadBdNq7UOtXQ-Z1rrqOcxmcl6jnWfXs2B0eo7zsfM1LbSlRrlcwvks1VF96s9k1-RYy%252B9reh31We69%252B4tIq-35fK2kJtw21PjZh-5%252BpgWiVdvm2S-AEXzsraJ1dkd6dbuGrpo9s1L3jogCtR95dk7vvrr%252B1uwHVHdAg-3WD2XEOgv1uDdD%252BrLS9NXsR8zpbzH71o6fZj9N2Pqq466zZ2yhPLtSYrQVvrlOKe1um7D2ncGXea57UhxbyOMareHXqrnBrx10zw-1Aj3c9aMAgN835-yjhsp4-92qc2Tva9rih1rpnzOxdzQlpLVGJx8bxxbjLwnsu8FyzbmTyvKmVY0zVx3xX6-KedzTj3CPmvLaNzFtzIOBPfvt6NzzpORsDeH63qbKeted711nw8cWQBccT4X1L%252BO2CZbE6Jivfu8u29J3XxTDfIcNvk83rTbu2-w7YGnlnXe2vZ977ntftlB9j%252BcxTofzmJ8a%252B-%252BG3-Xsp9PcFskdb1UN2daUnk1pGUtpmVDp9pKMT4aNj9u1K4vcQCM8LtJMMNR0QVg8dt5V9slVkDGcZ8B1K9sDA9NsloJ0%252BdnsLU3tF1PsV1zE11ftN0AddEgdFcnl5cC5LNUoa8T0L8Gt6NSCUcE0DcMd7830n8Lcf0d8q87dj8HdkDKd-8AtADUDgCdcfdMD0NrscC7tqDedo9rZp0EBZ1Bdhcl0vsWCfsrEOVpdEC5c0dwcA1kD1DWlRCzs79Uck1DdpCcdZCesrdJN-0lDBC5NydVCndhCf84iEMTs0CdDQDfdwCKCNtcCcMQ924w8u4RpI8SMyM48YYnCOVNDr8xDM8scH8bEP089l8i9zd0sN9y9QiaVwj99T9D9lNG9GgqsytPD29KifDZ8aiOtgiB9lDP8htVCZiqd1c-8KiDMqi-BAic96jEtGjV8S9WixNt9wDOj7dujSsj9IjIoD9TiW8EivYr8VjRiTNxiLNJjbNpi39ZjziKt5ihifjljTtvdUi9C1sppKCsj7sJ1dsFUiDPjZEkjtD09Is0jrcMisMwTjCdFaCLCBd51GDRdHVWCHC3UEDd0eDXDuCuZhshi7jr0ASMC40-DH0pC58gj6jn95DDiSdjjoiYTlhYi1dJsf8-jkiETWcJN9DOdMijDtsHVTDTU6DXshd3sbDmCnVCSk93VE9yTWYk03CKSPCbi4dvDaTES1iGT2YAjmTTcXjLcxTGwjjlDa0%252BiIMfiDSvC4SmcRSu9yCDDQSpSZVQ83kI9Plo9SNY8KMyiiS-ib9ddHjjdaiF8l8gcV9i8Wiy99j2i7TOSHSm8eidAnT1NcyFiBTEjp8HjxC4yJjWS5DX8PN385j3iiydNBTiDU9Vj6SniNirMtikymjF80sdo9it8Mzic98uT%252Biz8R9Ljqtrj%252BSmySymsyzqiKzniqyesayxsP8GyXTZyZsAtXSGkdz3c6cuVjsr1hTb9mNvSxUAzw8Ci8D1tUS-SJ0PV1TDED1Xy%252BtI1V5Fy-BIkwBd4aYD5iT4ADFtT3yTFbDVSN12NoSHEf4-4AE3FgFPEwEfFIF-EYEglvh4FEFkFCFgQIl1EYQ4QYkkRhZ4l8FMRiF8QuFiQKF0lqF2hskGFclmF8ltYQSikyESlEkR8hi-jvzjTRS-yAKtEgKIzT5Wxz5eDjEb5xc2CYLDt7Fv4nFf5BZAF3EQEvFwFfEoEAlYFgkcKwl8LUE-zolsFyK0REksRklaKdR6LGhGKqQaR6FGE8lWFClr9ikwBSl5g%252BL9yqSSCfy2dkTrssARk7pCYJkSZnpOCqMOx5lFkvsVkEUNlTknRdlLl19Tljl0rzk9krkblVk2AHlvUbz8iPl4Ao8Y9yN48Hzud7zwUnxoUHhCA4UEUkVMhsJvg0UMxAZFBgY2BQZJBwY8VJACVPz3S2zbT-dVo45NpIqWV4CJKkCeSgqhKvSFCUSGrsj8C9sQADsR91r0CTSQqsCfTJSecMTZTzDLCcSRdIKCToKiSVqXCdTySBD6duVArWzgqjcH1zSmSOzqMzc%252By2Thzd9q8vqisQN8zGzdzachT4SLyyCtqLrHyrqZSFZbrsSGCHqVSnrJcOCXytTQc%252BCldoaoc6tizbijSTrRT9d-CgblyrTVyCcZrIaIjKaydYaYim1tzqa5zaapq-qryA9LrGrnlcjAy7yqqiiwy6qVrOYozpr1i3MEyGieydjUyuBsshyObFCuicyri8y%252BbxzCyfrSyNqxiWbH82bXiYS3MGzNzayvNfiWyrb6bfDga6iuz88T5kzmiBy0z9bK97THaTjpzTaeSpzBj9zqTozdD2zbaKg%252B9%252ByHbuanbXbJzviAqAqkaPSUawDQqJSMbJbITCClLuaUC%252BVC6Yzi7zrS6drwSTDsanssT6DFTcTHr7DnrXzXq90yT%252BDKT466aUi6T-rJDU1LSQbrT2Trdw7M7HSzbnT86PagC66k6Dbtqg9dqsazD267q8blSxc7CJd2Dp4Sa3r3yPqR7DzL8x7PSbaAbvoLTgbs056IbDaxyIM4aBaJshbDSRbrbUb0j0bm70S25XlbzKriMQzijwy4rEDlb16O8-q1bfb4tuyC9ez%252B918Q6csFDF6Ty2BI6yt8yBiatLaFyQHyye9U6571zh8Xaxt3a1rfraGlz6GNbsGA7cH06hNdbN9CGOTRzszzaTbJyyGqHR6OGvabb6G062SmG6yY7c776ps86NGNcC7pqxa5qGV44YCdpk5lqkHyjUHa69G0am7d6W69qoSq6SHYSzzkb66kTG7xay697jUbrD7cau78bT6oKibL7NTr6Fdh79TtH5y0HOHTSJCmbp737Qa8GbSw6syI7uTq61C172HXHN7ASzrxSvGIHpTfG27%252BdO7rCmDgnCaL6NSuCInyb3CeTqG4n5HYyX64A37baP77b0miHMml7snnHeT%252BatHBaEbhj1VRabHSm7HIHMByrCNCj4GFbSjzHIzLH7j4nk7uHc9eGSr%252BHn9S8hG2iDbiHgseashKHeiV6CzJH2mRi9nu8Tc7aUypjHb5iWHx88nq7H6i6uH3nMG%252ByjmUtPn8Hzn0zLnhnnHY6zicnpGZypn3cE7VaZ6GGBnes3js7fmv9JmAHpnjzrma7ZnXn9GQSJafHZUCCDroSAXgHOmG6Sn6rFnynJ0-GqmFSam8T5K1SpctndSwLImKaxnnndnmWlzun0dkm%252BnUmBH56wi4XrmVCY6%252BTUW28SWVdjrx7Trt7wH2WHsuX5SrClTan8Te7QnGmZdmmSS9S2nZHPa9WGazTX7mae9%252BnIXBnRGob4Xl71WJmYnYNg2gGCnrGwHbGqCOWVmgy5b1narNmSaUH8maGpWEmU6eH-bjntbg7oXQ6hmxGsmJGo6pHjbS2JWaT039mQWlHqzcWNz6zs62HGXnWn7YyDnNjs2IWg6oW9aRGF6VX60EX7nA2S247Q23S22gWM3FHGGG3mGm3WHCXqdNHJ2DzNW13N3mzU2V4FEI2S6nlwr8ZYCiYYqyYiLRLdpxKhXmY3yFcU24LVKEKhYURngEEJYpYZZqA5YTXVZ1ZNYClOK2ADZVAjYTYlBzZLY-3-L130AfYgxdX22WXgSIDoDFq4DU4qXvH7H72C4U3W2N6D3PGoH8MKqiMlmbsjXnzNSOCZLtmYSvz92-qRLNFr26YXzQKybZKlkz6FLOyv5HEVg1KXENLkLQFvEIE-FoFAk4FQkkFAQTLCKKZiKsFYlLKEkykbKSE7K0lHLMkmKXKckmEWEgP2EuLPRfK%252BE77t3w0BLmPXnWO95tFgLJLpLXCIKCarXrEONBP4L1KkKPEJOdL0KZODLsL5O8LqACK0EVPzL1OURNOqLbLvK9OyQDPnK6RjP3KzPdYvLuKfLeKbOiWjynWiO5nI2j2Iqxkz2plYqXyEqFlezb4Ur1lDkj3Mr9kMscqTlvU3gLkaRrlWv7kF9Y3Za4GaqSjAVfTMamqoUYU2q4gOqsBkVurYq01%252BrBr4BhrRr8VSckOZ3inUOoCjGMPTGsOhXVrCOtDCmJ7KWqPo2ZUK76WnHSWDv3GgTZrsOynjXKnTX7qT7LXz7HDLu7XD1Wnq7K3E6inJ6knn15XP7YWi2Rneax3V713tWg13ut77vDDZvOW-uO6eXzW%252BW%252BOBXibwnB73qonHW4PAWPvk6ZXenPWFXwake-XVWA2kWg3bOQ3eew3yuKX5m2XHvcNpaYGiNqrQzE2E8uCCOxn6et6MGs3tjvWzn%252B2DjB3kf-Xy3yGHm7nz86e5GXXvaU6621yF3VGcn1H%252BfEadmq2TeFGQWVeta1fByB3lXtfOfdfEWxmR3DfbeZmHfkPgXajzevnM6fml2-mMf-mFemXHfQHD2Re0SOXnvDrdGKvk-vvqPW6D7uWzXu6vPgeXrQeqeb6afIeyuOnE-yymePX3mvXe2fWteOfh2ue-eNWSutXM%252BhfKuU%252Bny8%252B5SifC%252Bgmgf%252BP%252B6y-STqexXSWoeMXEnGS5WWfEeMmvf2-RnSXcnY%252Bjfw2s%252BSOc-RecjoHyO1nJvEHk3k97foeJ7lfDnu2QBA6wbdiCHNfPe2-a9kXo7ufx2ZHd%252B03a%252BofSst6xxbfNna0fAlhjxVroNMWLvHBrmz7bCM3%252BHRIdp-x96jsf%252BtzCcvPxgE%252B1w%252BGdeFlHzUZbkV2ixPnt310y99q2BrMVCdwWpjJzusvGXPLze4J8Q%252Bn3DnAsyP4ONK6R1NgYdxoFcDU%252Bv3fPv92PoWt%252BWfdQVlfXL6isIe4ravi82oGM0l%252B8PFftiy-pXMN%252BqPTAcQBbbx89%252BffbPg92EE0E-2R9QJoD0kHWtXOpNejrqU%252BoKD-%252BNfdgYzynpqDG%252BrPOQpoNQGlw1Wug%252BGqV2cFWN9%252BrLQ-qYOP5kdVmwZc-orUu4sCdWxvVwW83jL39VezfdXkgJ8Hr80Bv-DAZ33QEB8KBGudFrgLN7zswBeLCAW7Tj6sDp2DPFIfPjSGu8Mh7vZAZmRyF%252BCv%252BZbPIUUNXYlDFeMPDBvgJfyW8Pi1vEgTv0D6Y8Gc-Ahobjxm7l06WGfe3ueXmHC9whg-a6oTwsG8se6JfSfjIOn4V9Z%252BKuHAa8xUGA1l%252Bng1foWw-5dDN%252BKubftMKoGACOBEBAfvj0xK7CSe%252BwiftIMp7HC5BDrKvsEMlZvC3BcPRoSyRAHZD7hURHQQUJAz-1%252BhsTEIUYIP4mCthpHPItEPjaxCk2tHK-ruyUEQjoRnZLBg-yf5pNMhFzNfvCJhpYDCyFDbAYoPBHJDhhFQyPuAOIHNtahiQ%252BoUr1gHND4BbvV-nCK5o69ehPQpkU8zZHB8BBnI7Fio3GF%252B8bexQv-KQJpp7koBqwtxjjw2FS0T%252BeI3DpsPx6X93O71BIcShOyCVqBTnQChx0Txcd7BnnOpt50Up2In2wnF9mJyC7aU0K0nfSlhRCQIJjK0XUykRXi5kVEulFQhNpxoqpcHK6XCkIZyy4sUTO7FNhHlwMzeUrO5SWnoH3s6KIyRDosSk6KBwuiPOclMnn3V9p%252Bdn2AXIBP6NQpSc9KmFOTmGIU7hJYuGCEihZVjHWVqKKSchJQicq0IjOGYnLhxXM75dLORXaJtMPlFrCDR-fYZCex2i1d5A0yW9olWa5FVUq7XDKgN0rjtdcqfXTroVWG6P9Ru4vU-jEOl5TdPhktCFGABaqwolubATqiih6rw9NumKIatihGq4o9uk1QwdQPu50CmUJjPaBdwtF8DwJZIhYdS1NG0t9qKwkkeSwgmGi8ektb4QEz2HF9-hFPJprIJaYginBgfUoRcLdY9MG%252BD%252BJvs-xCLs9JR3vREVvy76ojZseo27vq2Qk4dKO%252BE6pr8KInk8wmpEoEeRMcFz95RN-fVpcPdbXCGJXg5ifSNYnaDf6DzQIVq2XH6iYe-En7mL2NFxsJuj4i-kSPnjXdSRHI4UV23SFMS82GvCUUbWlEsiLaskhfuUOVFjCc6kwl4df08mds-a9kmkW0Ock-1HmpbNyXKLBEKiGhSokASqN8l8iphGo7iZhP%252BLYS1xWI-HunwZYGDBeWU4wbhJpZCTieRfd0QcIBESS8O9raSWcI8llD6%252BSkmQhoJYkuTNJaPPQfyKx5zDVxxUxYaVPMEESRJlU4ieJNtZkS6pxXLiQLxcGKjaJsrDwcpNuG%252Bt1JuQzqQEJRFkC5p6IoqZiJKmoSxusDKXggziHwToBNEn2nAL4YIDBGTk9qRFIN4yjIpE7KiYMNv6YsRhoA7kVUN5HLtdRGUuSa62ukijbpYo-Nh7xQGdCERsoqKfr1ZGxTgZpvOdt5MqGNt-pMfJcalNmn1JXhyQyCfNWgk0xWUtg60bMMQkEycJg01CXlNe4CjCpSE6mShMEnDThJFU8fmJJtbOEpp4PCiTJKRmeTmpy01qbCMeniNNpSI9Hv5Iykrj9JzMgSRyzKmj8rBtYmwQPUknTTFxaU3aeyIWmL8rhIsmEc3yVbQyGRpDR4WBk4k7TXcsUuWXdwVmGTIhuIkyadI2ZMDkGxIqyXrPim2TgpLQhyYgLpF3D1pDw1yQjPcmCyyhqMxKT5PxY1DAZ3suKUKNBl2SA5oU8UeLOLZwy9eXU56ecOUFfSuRhAnkRMJSnYyZZSc%252B2XxMdm58eBL3BCYzKpnZTDprMnYSNI5nWCGmtgsHg4Jmk2yg%252ByM5%252Bu4PJGz02pakjqcQD-o9SKZTcgQQZLrn71h%252BPwzuWrO7kazapfM%252BqUGgLlkiFJdElqcbMDkt93%252Boc2GVPK0nbTtRU7OeesJbk0zKOx0yXvLRl5kyvZBU%252Bab7NTn%252BzRRrQzORPKekTlopFbRqVdK8mxz0Zi7TGZAMrkfzrJ%252BszNmDJzYQyHpACiWa9N94cTCh2kkQkkIQUxyTZSU%252BOTgviI4yB5V8wBrbIrk6z6kQAA&amp;headers=%2523O_%257B%2522cache-control%2522%253A%2522max-age%253D0%2522%257D",
    "image_aspect_ratio": "1:1",
    "buttons": [
        {
            "index": 1,
            "title": "Buy",
            "action_type": "post",
            "target": "https://slice.so/frames/slicer/869/product/1/checkout?initialPath=%252Fframes%252Fslicer%252F869%252Fproduct%252F1&amp;previousButtonValues=%2523A_"
        }
    ],
    "input": {
        "text": "Quantity (default 1)"
    },
    "state": {},
    "post_url": "https://slice.so/frames/slicer/869/product/1?initialPath=%252Fframes%252Fslicer%252F869%252Fproduct%252F1&amp;previousButtonValues=%2523A_",
    "frames_url": "https://slice.so/slicer/869/products/1"
}
};

export const ParagraphFrame = TemplateWithInteractions.bind({});
ParagraphFrame.args = {
  url: "https://paragraph.xyz/@blog/introducing-smart-wallets",
  initialFrame: {
    version: "vNext",
    title: "Introducing Smart Wallets on Paragraph",
    image: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/highlight?text=Introducing%20Smart%20Wallets%20on%20Paragraph&author=Paragraph&url=%40blog&avatarUrl=https%3A%2F%2Fstorage.googleapis.com%2Fpapyrus_images%2Fd925b3511c5e20563b83a09cbe30bbf5&featuredImageUrl=https%3A%2F%2Fstorage.googleapis.com%2Fpapyrus_images%2F9a1a388602fbbf0be39a32259b167c84.jpg&size=2048",
    buttons: [
      {
        index: 1,
        title: "Open",
        action_type: "post_redirect",
        post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/open/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb",
      },
      {
        index: 2,
        title: "Read Inline",
        action_type: "post",
        post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/read/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb/0",
      },
      {
        index: 3,
        title: "Subscribe 🔔",
        action_type: "post",
        post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/subscribe/BMV6abfvCSUl51ErCVzd/3T2PQZlsdQtigUp4fhlb",
      },
      {
        index: 4,
        title: "Mint",
        action_type: "post",
        target: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/mint-buttons/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb",
      },
    ],
    state: {},
    frames_url: "https://paragraph.xyz/@blog/introducing-smart-wallets",
  },
};


ParagraphFrame.argTypes = {
  hash: { table: { disable: true } },
  frames: { table: { disable: true } },
};