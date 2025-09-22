export const PAGE_ITEM1 = 0;
export const PAGE_ITEM2 = 1;

export interface ApiItem {
  id: number;
  title: string;
  page: number | null;
  subitems: ApiItem[];
  disabled?: boolean;
}

export const apimenu: ApiItem[] = [
  // {
  //   id: 1,
  //   title: "Item1",
  //   page: PAGE_ITEM1,
  //   subitems: [],
  // },
  // {
  //   id: 2,
  //   title: "Item2",
  //   page: PAGE_ITEM2,
  //   subitems: [],
  // },
  {
    id: 1,
    title: "ParentA",
    page: null,
    subitems: [
      // {
      //   id: 10100,
      //   title: "P A",
      //   page: null,
      //   subitems: [],
      //   disabled: true,
      // },
      {
        id: 101,
        title: "Child1",
        page: null,
        subitems: [
          {
            id: 10101,
            title: "SubChild1",
            page: PAGE_ITEM1,
            subitems: [],
          },
        ],
      },
      {
        id: 102,
        title: "Child2",
        page: PAGE_ITEM2,
        subitems: [],
      },
    ],
  },
];
