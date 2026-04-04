export const MOCK_BLOGS = [
  {
    _id: 'mock1',
    title: 'THE DEATH OF MINIMALISM: CASE FOR NEO-BRUTALISM',
    slug: 'death-of-minimalism',
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Minimalism is boring. It lacks soul. We need bold lines, thick borders, and vibrant colors that scream for attention. Welcome to the era of Neo-brutalism.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'WHY NOW?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'In a world of rounded corners and soft shadows, the sharp edge is a revolutionary act.' }] }
      ]
    },
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    author: {
      _id: 'user1',
      name: 'VISHWAJIT SUTAR',
      image: 'https://avatars.githubusercontent.com/u/12345678?v=4'
    },
    status: 'PUBLISHED',
    category: 'DESIGN',
    readingTime: '5 min read',
    createdAt: new Date().toISOString(),
    likes: ['user2', 'user3'],
    isStaffPick: true
  },
  {
    _id: 'mock2',
    title: 'ALGORITHMS AS ARCHITECTURE: BUILDING FOR SCALE',
    slug: 'algorithms-as-architecture',
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Every algorithm is a blueprint. Every data structure is a load-bearing wall.' }] }]
    },
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    author: {
      _id: 'user2',
      name: 'OYSTER KODE',
      image: 'https://avatars.githubusercontent.com/u/87654321?v=4'
    },
    status: 'PUBLISHED',
    category: 'ENGINEERING',
    readingTime: '8 min read',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: ['user1'],
    isStaffPick: false
  },
  {
    _id: 'mock3',
    title: 'THE RHYTHM OF CODE: WHY POETRY MATTERS IN TECH',
    slug: 'rhythm-of-code',
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Code is meant to be read by humans first, machines second. Let it dance.' }] }]
    },
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    author: {
      _id: 'user1',
      name: 'VISHWAJIT SUTAR',
      image: 'https://avatars.githubusercontent.com/u/12345678?v=4'
    },
    status: 'PUBLISHED',
    category: 'CULTURE',
    readingTime: '4 min read',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    likes: [],
    isStaffPick: true
  }
];

export const MOCK_USERS = Array.from(new Set(MOCK_BLOGS.map(b => b.author._id))).map(id => {
  const author = MOCK_BLOGS.find(b => b.author._id === id)?.author;
  return {
    ...author,
    bio: 'Academic researcher and developer at OystersKode.',
    prn: '221000' + id.slice(-1),
    followers: 42,
    following: 12
  };
});
