export const dummyData = {
  memorials: {
    _embedded: {
      memorials: [
        {
          id: 1,
          name: "민서",
          age: 25,
          birthOfDate: "1998-03-15",
          deceasedDate: "2023-12-01",
          gender: "FEMALE",
          imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face",
          customerId: 1001,
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          eulogy: '민서님, 당신과 함께한 모든 순간이 소중했습니다. 하늘에서 편안히 쉬세요.',
          photos: [
            { id: 1, memorialId: 1, url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face", title: "프로필 사진", description: "고인의 아름다운 미소" },
          ],
          familyList: [
            { memberId: 1001, name: '김철수', relationship: '아들' },
            { memberId: 1002, name: '이영희', relationship: '딸' },
          ],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/1" },
            self: { href: "http://localhost:8080/memorials/1" }
          }
        },
        {
          id: 2,
          name: "현종",
          age: 32,
          birthOfDate: "1991-08-22",
          deceasedDate: "2024-01-15",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
          customerId: 1002,
          photos: [],
          familyList: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/2" },
            self: { href: "http://localhost:8080/memorials/2" }
          }
        }
        // ... other memorials
      ]
    },
    _links: {
      profile: { href: "http://localhost:8080/profile/memorials" },
      self: { href: "http://localhost:8080/memorials" }
    },
    page: {
      number: 0,
      size: 20,
      totalElements: 8,
      totalPages: 1
    }
  },
  members: [
    { id: 1001, name: "김철수", phone: "010-1234-5678", email: "kim.chulsoo@example.com", gender: "MALE" },
    { id: 1002, name: "이영희", phone: "010-9876-5432", email: "lee.younghee@example.com", gender: "FEMALE" },
    { id: 1003, name: "박민수", phone: "010-5555-1234", email: "park.minsu@example.com", gender: "MALE" },
    { id: 1004, name: "최수정", phone: "010-7777-8888", email: "choi.sujung@example.com", gender: "FEMALE" },
  ]
};