import * as _ from 'lodash';

const levels = [
  { category: 'None', depth: 1, parent: 'Articles' },
  { category: 'Basics', depth: 1, parent: 'Articles' },
  {
    category: 'Vectors, Matrices, And Arrays',
    depth: 2,
    parent: 'Basics'
  },
  {
    category: 'Preprocessing Structured Data',
    depth: 2,
    parent: 'Basics'
  },
  { category: 'Preprocessing Text', depth: 2, parent: 'Basics' },
  { category: 'Feature Engineering', depth: 2, parent: 'Basics' },
  {
    category: 'Model Evaluation',
    depth: 3,
    parent: 'Vectors, Matrices, And Arrays'
  },
  {
    category: 'Linear Regression',
    depth: 3,
    parent: 'Vectors, Matrices, And Arrays'
  },
  {
    category: 'Logistic Regression',
    depth: 3,
    parent: 'Vectors, Matrices, And Arrays'
  },
  {
    category: 'Support Vector Machines',
    depth: 3,
    parent: 'Vectors, Matrices, And Arrays'
  },
  {
    category: 'Trees And Forests',
    depth: 4,
    parent: 'Model Evaluation'
  },
  {
    category: 'Nearest Neighbors',
    depth: 4,
    parent: 'Model Evaluation'
  },
  { category: 'Naive Bayes', depth: 4, parent: 'Model Evaluation' },
  { category: 'Clustering', depth: 4, parent: 'Model Evaluation' },
  { category: 'Keras', depth: 4, parent: 'Model Evaluation' },
  { category: 'Data Wrangling', depth: 2, parent: 'Basics' },
  { category: 'Data Visualization', depth: 2, parent: 'Basics' },
  { category: 'Web Scraping', depth: 3, parent: 'Data Wrangling' },
  { category: 'Testing', depth: 4, parent: 'Data Wrangling' },
  { category: 'Other', depth: 1, parent: 'Articles' },
  { category: 'Frequentist', depth: 4, parent: 'Model Evaluation' },
  {
    category: 'Algorithms',
    depth: 2,
    parent: 'Basics'
  },
  { category: 'Cloud Computing', depth: 5, parent: 'Clustering' }
];

export const getFlatLevelsData = () => {
  const levelNames = _.map(levels, level => {
    return { name: level.category, ...level };
  });

  const flatData = [
    {
      name: 'Articles',
      depth: 0,
      parent: null
    },
    ...levelNames
  ];

  console.log('getFlatLevelsData: ', flatData);

  return flatData;
};

export const getFlatArticlesData = links => {
  const getLinkLevel = category => {
    const cat = _.find(levels, { category });
    return cat;
  };

  const linksWithCats = [];
  _.map(links, link => {
    const cat = getLinkLevel(link.Category);
    if (cat)
      linksWithCats.push({
        name: link.Name,
        link: link.Link,
        ...cat
      });
  });

  const flatData = [
    {
      name: 'Articles',
      depth: 0,
      parent: null
    },
    ...linksWithCats
  ];

  console.log('getFlatArticlesData: ', flatData);

  return flatData;
};
