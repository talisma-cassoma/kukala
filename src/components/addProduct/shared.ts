import type {ProductData, RichTextNode, SectionCardProps, TextFieldProps, TextAreaFieldProps} from '@/components/addProduct/types'

export const createEmptyProduct = (): ProductData => ({
  pageTitle: 'Fresh product draft',
  pageDescription: 'Create a rich product experience with flexible content sections.',
  product: {
    id: 'product-draft',
    __typename: 'Product',
    name: 'Chocolate Dream',
    path: '/shop/chocolate-dream',
    topics: [{ name: 'new' }, { name: 'limited-edition' }],
    bundle: { content: null },
    summary: {
      content: {
        json: [
          {
            kind: 'block',
            type: 'paragraph',
            metadata: {},
            children: [
              {
                kind: 'inline',
                metadata: {},
                textContent: 'A rich chocolate experience with a soft crumb and a glossy finish.'
              }
            ]
          }
        ]
      }
    },
    body: {
      content: {
        paragraphs: [
          {
            title: { text: 'Our signature donut' },
            body: {
              json: [
                {
                  kind: 'block',
                  type: 'paragraph',
                  metadata: {},
                  children: [
                    {
                      kind: 'inline',
                      metadata: {},
                      textContent: 'Bake fresh, glaze generously, and serve with a smile.'
                    }
                  ]
                }
              ]
            },
            images: []
          }
        ]
      }
    },
    table: {
      content: {
        sections: [
          {
            title: 'Nutrition',
            properties: [
              { key: 'Calories', value: '143 kj' },
              { key: 'Protein', value: '2.4 g' }
            ]
          }
        ]
      }
    },
    related: {
      content: {
        items: [
          {
            id: 'related-product-1',
            __typename: 'Product',
            name: 'Strawberry blast',
            path: '/shop/strawberry-blast',
            topics: [{ name: 'limited-edition' }, { name: 'glazed' }],
            bundle: { content: null },
            defaultVariant: {
              firstImage: {
                url: 'https://crystallize.com',
                altText: 'Strawberry donut',
                variants: []
              },
              priceVariant: { price: 6, currency: 'USD' }
            }
          }
        ]
      }
    },
    defaultVariant: {
      firstImage: {
        url: 'https://crystallize.com',
        altText: 'Chocolate donut',
        variants: []
      },
      priceVariant: { price: 8, currency: 'USD' }
    },
    variants: [
      {
        id: 'variant-1',
        name: 'Chocolate Dream',
        sku: 'chocolate-dream-1',
        price: 8,
        priceVariants: [
          { identifier: 'default', name: 'Default', price: 8, currency: 'USD' }
        ],
        stock: 37,
        isDefault: true,
        attributes: [{ attribute: 'Donut size', value: 'M' }],
        images: []
      }
    ]
  }
});

export const buildParagraphJson = (text: string): RichTextNode[] => [
  {
    kind: 'block',
    type: 'paragraph',
    metadata: {},
    children: [
      {
        kind: 'inline',
        metadata: {},
        textContent: text
      }
    ]
  }
];




