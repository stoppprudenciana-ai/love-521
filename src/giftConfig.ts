export type LetterBlock =
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'photo'
      src: string
      caption: string
    }
  | {
      type: 'quote'
      text: string
    }
  | {
      type: 'memoir'
      kicker: string
      title: string
      text: string
      photos: MemoirPhoto[]
    }

export type MemoirPhoto = {
  src: string
  caption: string
  tone: 'portrait' | 'landscape' | 'tall' | 'square'
  width: number
  height: number
  featured?: boolean
}

export const giftConfig = {
  date: '2026.05.21',
  passcode: '月月鸟',
  recipientName: '亲爱的小瓶子大大',
  senderName: '月月鸟',
  qrMessage: '我读完啦，来领521',
  music: {
    src: '/audio/romantic-piano.mp3',
    title: 'Romantic Piano',
    source: '没有 mp3 也没关系，会先使用网页内置的柔和音乐盒。',
  },
  photos: [
    {
      src: '/photos/memory-01.jpg',
      caption: '车里的第一张小小合照',
    },
    {
      src: '/photos/memory-02.jpg',
      caption: '靠得很近的时候',
    },
    {
      src: '/photos/memory-03.jpg',
      caption: '戴上头套以后，世界就变幼稚了一点',
    },
  ],
  letter: [
    {
      type: 'paragraph',
      text: '亲爱的小瓶子大大，想了很多话想对你说，但最终还是觉得，应该认真写一份给你的信。',
    },
    {
      type: 'paragraph',
      text: '不知不觉我们已经认识了 268 天，时间真的过得好快。在我们相处的这段时间里，有相见时的狂欢喜悦，一个大大的拥抱，整个空间就只剩下了我们彼此。',
    },
    {
      type: 'memoir',
      kicker: 'Memoire I',
      title: '我们被时间收藏的样子',
      text: '有些照片不是为了拍得多完美，而是它们真的把那个时刻留住了：靠近一点、再靠近一点，然后世界就只剩下我们两个。',
      photos: [
        {
          src: '/photos/memory-01.jpg',
          caption: '在车里并排坐着，阳光刚好落下来。',
          tone: 'portrait',
          width: 1280,
          height: 2147,
          featured: true,
        },
        {
          src: '/photos/memory-02.jpg',
          caption: '一起把脸凑近镜头，像在确认彼此真的在身边。',
          tone: 'portrait',
          width: 1280,
          height: 2147,
        },
        {
          src: '/photos/memory-04.jpg',
          caption: '近到鼻尖和呼吸都像悄悄说话。',
          tone: 'tall',
          width: 1024,
          height: 2254,
        },
        {
          src: '/photos/memory-03.jpg',
          caption: '戴着可爱的头套，认真地幼稚一下。',
          tone: 'portrait',
          width: 1280,
          height: 2147,
        },
      ],
    },
    {
      type: 'paragraph',
      text: '脸会贴着很近，鼻尖对着鼻尖，用心感受对方的温度，是一种由内而外散发出的幸福感。离别时，也会有从内心深处涌出来的悸动和不舍。',
    },
    {
      type: 'quote',
      text: '仿佛生活中的每一件事，我们都在同频中。',
    },
    {
      type: 'paragraph',
      text: '你曾经问过，我了解你吗。其实我认为我的察觉还是比较灵敏的。你的内心很敏感，会因为一件事想到好久都睡不着、闭不上眼；在紧张的时候，整个人还会发抖。',
    },
    {
      type: 'paragraph',
      text: '我也很喜欢小瓶子有时候看起来很搞怪的模样，总能一下子逗笑月月鸟。每次我叭叭叭张嘴说个不停的时候，小瓶子也总是愿意当我的倾听者，陪着我笑，陪着我闹。',
    },
    {
      type: 'paragraph',
      text: '你真的改变了月月鸟很多。以前的我总是很容易精神内耗，可是现在每天醒来的第一件事，就是想找小瓶子，想看看小瓶子在做什么，早餐吃了什么，有没有在上课。',
    },
    {
      type: 'memoir',
      kicker: 'Memoire II',
      title: '一起去过的地方，都会发光',
      text: '我们一起坐车、拍照、玩闹、吃东西。那些普通日子因为有你在，就变成了我会反复想起的片段。',
      photos: [
        {
          src: '/photos/memory-05.jpg',
          caption: '水族馆那一刻，像被蓝色的光轻轻包住。',
          tone: 'tall',
          width: 1024,
          height: 2254,
        },
        {
          src: '/photos/memory-07.jpg',
          caption: '雪场里笑起来的时候，连冷空气都变甜了。',
          tone: 'tall',
          width: 1024,
          height: 2254,
        },
        {
          src: '/photos/memory-06.jpg',
          caption: '有点好笑、有点可爱，也很像我们。',
          tone: 'landscape',
          width: 1524,
          height: 859,
          featured: true,
        },
        {
          src: '/photos/memory-08.jpg',
          caption: '夜色里并肩坐着，城市在窗外慢慢后退。',
          tone: 'square',
          width: 960,
          height: 1278,
        },
        {
          src: '/photos/memory-09.jpg',
          caption: '路上的合照，也会变成以后想念的证据。',
          tone: 'landscape',
          width: 1706,
          height: 1279,
        },
        {
          src: '/photos/memory-10.jpg',
          caption: '奇奇怪怪的展览，因为和你一起就很有意思。',
          tone: 'portrait',
          width: 1280,
          height: 1703,
        },
        {
          src: '/photos/memory-11.jpg',
          caption: '连吃烤串都要凑一个爱心给世界看。',
          tone: 'portrait',
          width: 1279,
          height: 2024,
        },
      ],
    },
    {
      type: 'paragraph',
      text: '上面那张水族馆的照片，我一直记得很清楚。第一次一起去看水族馆的时候，我们看到了各种各样的海洋生物，镜头里也有美美的小瓶子。那天风很大，也很冷，可是小瓶子会把我的手紧紧握住，放进口袋里不断地搓。那一刻，幸福感仿佛真的具象化了。一见钟情之后的日久生情，让月月鸟越来越喜欢小瓶子，也越来越爱小瓶子。',
    },
    {
      type: 'paragraph',
      text: '后来在重庆旅行的那几天，时间过得好慢好慢，仿佛一切都用上了 0.5 倍速的滤镜。可是恍惚间又过得好快好快，一下子又到了要离别的时候。',
    },
    {
      type: 'paragraph',
      text: '我们坐在广场的椅子上，你静静地听着我对未来的憧憬，那一刻真的感觉好幸福。你的出现和陪伴，让我在两点一线的生活里，不再觉得孤单、无聊。',
    },
    {
      type: 'paragraph',
      text: '有个非常高兴的事情：我们的父母对我们很好，朋友对我们很好，同时我们还遇到了彼此。一起吃美食，一起去好玩的地方，一起探索这个世界奇奇怪怪但是又很有意思的新鲜事。',
    },
    {
      type: 'paragraph',
      text: '你的体贴、理解与包容，就像上天派来的小天使一样，是那么温柔。你的心思敏感细腻，非常容易捕捉到一个人的情绪变化，总是安慰好别人，却把坏情绪留给自己消耗。',
    },
    {
      type: 'paragraph',
      text: '亲爱的小瓶子，你应该要跟我说的。不管发生什么事情，难过的、开心的，都应该分享给我。你说不想把负能量传递给我，但是我的小瓶子如果都憋着自己消化，月月鸟又怎么能开心得起来呢。',
    },
    {
      type: 'paragraph',
      text: '每次看到你一个人消化情绪后红肿的眼睛，我都超级超级难受，恨不得马上能穿越到你的身边，一直一直抱着你。当你独自消化情绪，我也会很自责。',
    },
    {
      type: 'paragraph',
      text: '小瓶子教会我，发生的事情都要说出来，不能憋着。情侣之间是最亲密的，所以以后开心也好，难过也好，都让我陪你一起分担，好不好。',
    },
    {
      type: 'paragraph',
      text: '以后的每一个节日、纪念日、生日，还有许许多多普通却珍贵的日子，我们都要手挽着手，拥抱，亲吻，用余生的时光慢慢地、坚定地走下去。',
    },
  ] satisfies LetterBlock[],
}
