migrate(db => {
  // create initial superadmin user
  const dao = new Dao(db)

  const admin = new Admin()
  admin.email = 'juniors@jota.one'
  admin.setPassword('blablablabla')
  dao.saveAdmin(admin)

  // create CMS tables
  const collectionDefs = [
    {
      id: '7rhu87z0qx1hq88',
      name: 'HcConfigs',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'abjoe2k8',
          name: 'value',
          type: 'json',
          required: true,
          presentable: false,
          unique: false,
          options: {
            maxSize: 2000000,
          },
        },
        {
          system: false,
          id: 'smouaeq3',
          name: 'key',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '[a-z0-9-_\\.]+',
          },
        },
      ],
      indexes: [],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'zalbifbkfdjf4ph',
      created: '2024-11-18 15:24:56.609Z',
      updated: '2024-11-18 15:24:56.609Z',
      name: 'HcRoles',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'v7fveiln',
          name: 'name',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'br1inx9nr82mah7',
      name: 'HcContents',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'bvd0cx34',
          name: 'blocks',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 2000000,
          },
        },
        {
          system: false,
          id: 'r5e3m3ni',
          name: 'state',
          type: 'select',
          required: true,
          presentable: false,
          unique: false,
          options: {
            maxSelect: 1,
            values: ['draft', 'published', 'backup'],
          },
        },
        {
          system: false,
          id: 'wd8zqlae',
          name: 'editorVersion',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '\\d+\\.\\d+\\d\\.\\d+',
          },
        },
        {
          system: false,
          id: 'jv3frsrt',
          name: 'name',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule:
        "@request.auth.Role.name = 'admin' || @request.auth.Role.name = 'superadmin'",
      deleteRule: null,
      options: {},
    },
    {
      id: 'io4ai0v08gkmmln',
      name: 'HcLabels',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'ibe3zb8y',
          name: 'key',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: '9qha72a6',
          name: 'value',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'ztu7rm4j',
          name: 'Lang',
          type: 'relation',
          required: true,
          presentable: false,
          unique: false,
          options: {
            collectionId: '09zlcfzxr29yom7',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: '09zlcfzxr29yom7',
      name: 'HcLangs',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'gbazeuwm',
          name: 'code',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: 2,
            max: 5,
            pattern: '[a-z]{2}',
          },
        },
        {
          system: false,
          id: 'b6odmume',
          name: 'sort',
          type: 'number',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            noDecimal: false,
          },
        },
        {
          system: false,
          id: 'tvl368vs',
          name: 'isDefault',
          type: 'bool',
          required: false,
          presentable: false,
          unique: false,
          options: {},
        },
        {
          system: false,
          id: 'zqfwhhve',
          name: 'label',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'yp7cwnuv',
          name: 'active',
          type: 'bool',
          required: false,
          presentable: false,
          unique: false,
          options: {},
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'bujm8joyamo70hu',
      name: 'HcPages',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: '8m2xzxp0',
          name: 'name',
          type: 'text',
          required: false,
          presentable: true,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'xmleo7z7',
          name: 'sort',
          type: 'number',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            noDecimal: false,
          },
        },
        {
          system: false,
          id: 'npb031bw',
          name: 'show',
          type: 'select',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSelect: 1,
            values: ['always', 'active', 'never'],
          },
        },
        {
          system: false,
          id: '8qnoj0tp',
          name: 'Parent',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'bujm8joyamo70hu',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: '7g5epwif',
          name: 'resolveSlug',
          type: 'bool',
          required: false,
          presentable: false,
          unique: false,
          options: {},
        },
        {
          system: false,
          id: '8hdhdi93',
          name: 'active',
          type: 'bool',
          required: false,
          presentable: false,
          unique: false,
          options: {},
        },
        {
          system: false,
          id: 'gxrfdk4q',
          name: 'Role',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'zalbifbkfdjf4ph',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: null,
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'h8s02t2mdppb6ik',
      name: 'HcPagesLang',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: '6eyccnap',
          name: 'Page',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'bujm8joyamo70hu',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: 'vzxsnkhh',
          name: 'Lang',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: '09zlcfzxr29yom7',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: 'x5vqclnk',
          name: 'slug',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'punuyabq',
          name: 'label',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: '3swh5i5v',
          name: 'Content',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'br1inx9nr82mah7',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'uponta6pnjmy6yw',
      name: 'HcTeasers',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'e5aa8sjq',
          name: 'Page',
          type: 'relation',
          required: false,
          presentable: true,
          unique: false,
          options: {
            collectionId: 'bujm8joyamo70hu',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: ['name'],
          },
        },
        {
          system: false,
          id: 'tvmfvdki',
          name: 'activeFrom',
          type: 'date',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: '',
            max: '',
          },
        },
        {
          system: false,
          id: 'qfwefoph',
          name: 'activeTo',
          type: 'date',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: '',
            max: '',
          },
        },
        {
          system: false,
          id: 'sw0jyekj',
          name: 'slugValue',
          type: 'text',
          required: false,
          presentable: true,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'q89vcgmwdnews1v',
      name: 'HcTeasersLang',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'htbvj8qb',
          name: 'Teaser',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'uponta6pnjmy6yw',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: '6evejguo',
          name: 'Lang',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: '09zlcfzxr29yom7',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: 'cuv3mxkz',
          name: 'Content',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'br1inx9nr82mah7',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: '4pv7qgsq',
          name: 'title',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: '1he0v5mx',
          name: 'description',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'xg4kvkz1',
          name: 'linkLabel',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'svxt0cp4',
          name: 'tags',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 2000000,
          },
        },
        {
          system: false,
          id: 'gsclktcd',
          name: 'Image',
          type: 'file',
          required: false,
          presentable: false,
          unique: false,
          options: {
            mimeTypes: [
              'image/jpeg',
              'image/png',
              'image/svg+xml',
              'image/gif',
              'image/webp',
            ],
            thumbs: ['480x720'],
            maxSelect: 1,
            maxSize: 5242880,
            protected: false,
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'q60mgarih7dy0ij',
      name: 'HcTeasersTargets',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'bjtddfwf',
          name: 'Teaser',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'uponta6pnjmy6yw',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: ['Page', 'slugValue'],
          },
        },
        {
          system: false,
          id: 'yfvci23g',
          name: 'Page',
          type: 'relation',
          required: false,
          presentable: false,
          unique: false,
          options: {
            collectionId: 'bujm8joyamo70hu',
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: [],
          },
        },
        {
          system: false,
          id: '1fwqs7wm',
          name: 'slugValue',
          type: 'text',
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    },
    {
      id: 'bhqxj7f15y4cgkp',
      name: 'HcNavigation',
      type: 'view',
      system: false,
      schema: [
        {
          system: false,
          id: 'fw4eij5t',
          name: 'name',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: 'ieu86o46',
          name: 'sort',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: 'vigrgtu6',
          name: 'show',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: 'euvecxrq',
          name: 'resolveSlug',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: '5zm19onj',
          name: 'lang',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: '9k1hyaaw',
          name: 'langCode',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: 't4jnotjx',
          name: 'path',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
        {
          system: false,
          id: 'n79xfobc',
          name: 'sortedPath',
          type: 'json',
          required: false,
          presentable: false,
          unique: false,
          options: {
            maxSize: 1,
          },
        },
      ],
      indexes: [],
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {
        query:
          'WITH RECURSIVE Navigation AS (\n' +
          '  SELECT\n' +
          '    pl.id as id,\n' +
          '    pl.Content as contentId,\n' +
          '    p.id AS pid,\n' +
          '    p.name,\n' +
          '    p.sort,\n' +
          '    p.show,\n' +
          '    p.resolveSlug,\n' +
          '    pl.Lang,\n' +
          '    pl.label,\n' +
          '    l.code AS langCode,\n' +
          "    IFNULL(r.name, 'all') AS access,\n" +
          "    ('/' || l.code) AS path,\n" +
          "    ('/' || l.code) AS sortedPath\n" +
          '  FROM HcPages AS p\n' +
          '    JOIN HcPagesLang AS pl ON pl.Page = p.id\n' +
          '    JOIN HcLangs AS l ON l.id = pl.Lang\n' +
          '    LEFT JOIN HcRoles AS r ON r.id = p.Role\n' +
          "    WHERE p.Parent = '' AND l.active = TRUE\n" +
          '  UNION\n' +
          '  SELECT\n' +
          '    pl.id as id,\n' +
          '    pl.Content as contentId,\n' +
          '    p.id AS pid,\n' +
          '    p.name,\n' +
          '    p.sort,\n' +
          '    p.show,\n' +
          '    p.resolveSlug,\n' +
          '    pl.Lang,\n' +
          '    pl.label,\n' +
          '    l.code AS langCode,\n' +
          "    IFNULL(r.name, 'all') AS access,\n" +
          "    (n.path || '/' || pl.slug) AS path,\n" +
          "    (n.path || '/' || (p.sort + 1) || '.' || pl.slug) AS sortedPath\n" +
          '  FROM HcPages AS p\n' +
          '\tJOIN Navigation AS n ON p.Parent = n.pid\n' +
          '    JOIN HcPagesLang As pl ON pl.Page = p.id\n' +
          '    JOIN HcLangs As l ON l.id = pl.Lang\n' +
          '    LEFT JOIN HcRoles As r ON r.id = p.Role\n' +
          '   WHERE pl.Lang = n.Lang\n' +
          ')\n' +
          'SELECT id, contentId, access, name, label, sort, show, resolveSlug, Lang AS lang, langCode, path, sortedPath FROM Navigation ORDER BY lang, path;',
      },
    },
  ]

  for (const collectionDef of collectionDefs) {
    const collection = new Collection(collectionDef)
    dao.saveCollection(collection)
  }

  // Update system users collection
  const userCollection = dao.findCollectionByNameOrId('_pb_users_auth_')
  userCollection.schema.addField(
    new SchemaField({
      system: false,
      id: 'sinah9qa',
      name: 'Role',
      type: 'relation',
      required: false,
      presentable: false,
      unique: false,
      options: {
        collectionId: 'zalbifbkfdjf4ph',
        cascadeDelete: false,
        minSelect: null,
        maxSelect: 1,
        displayFields: null,
      },
    })
  )

  dao.saveCollection(userCollection)

  // Add some contents
  const HcRoles = dao.findCollectionByNameOrId('HcRoles')
  const HcPages = dao.findCollectionByNameOrId('HcPages')
  const HcLangs = dao.findCollectionByNameOrId('HcLangs')
  const HcContents = dao.findCollectionByNameOrId('HcContents')
  const HcPagesLang = dao.findCollectionByNameOrId('HcPagesLang')

  const userRole = new Record(HcRoles, { name: 'user' })
  const adminRole = new Record(HcRoles, { name: 'admin' })
  const superadminRole = new Record(HcRoles, { name: 'superadmin' })
  dao.saveRecord(userRole)
  dao.saveRecord(adminRole)
  dao.saveRecord(superadminRole)

  const homePage = new Record(HcPages, {
    name: 'home',
    sort: 0,
    show: 'always',
    resolveSlug: false,
    active: true,
  })
  dao.saveRecord(homePage)
  const contactPage = new Record(HcPages, {
    name: 'contact',
    sort: 10,
    show: 'always',
    resolveSlug: false,
    active: true,
    Parent: homePage.id,
  })
  dao.saveRecord(contactPage)
  const aboutPage = new Record(HcPages, {
    name: 'about',
    sort: 5,
    show: 'always',
    resolveSlug: false,
    active: true,
    Parent: homePage.id,
  })
  dao.saveRecord(aboutPage)

  const frLang = new Record(HcLangs, {
    code: 'fr',
    sort: 0,
    isDefault: true,
    label: 'Français',
    active: true,
  })
  dao.saveRecord(frLang)
  const enLang = new Record(HcLangs, {
    code: 'en',
    sort: 0,
    isDefault: false,
    label: 'English',
    active: true,
  })
  dao.saveRecord(enLang)

  const homeFrContent = new Record(HcContents, {
    blocks: JSON.stringify([
      {
        id: 'tnAEGFJEcx',
        type: 'BlockTitle',
        props: {
          text: 'Accueil',
        },
      },
    ]),
    state: 'published',
    editorVersion: '2.26.5',
    name: '',
  })
  dao.saveRecord(homeFrContent)
  const homeEnContent = new Record(HcContents, {
    blocks: JSON.stringify([]),
    state: 'published',
    editorVersion: '2.26.5',
    name: '',
  })
  dao.saveRecord(homeEnContent)
  const contactFrContent = new Record(HcContents, {
    blocks: JSON.stringify([
      {
        id: 'axBTmiGid_',
        type: 'BlockTitle',
        props: {
          text: 'Contactez-nous!',
        },
      },
      {
        id: '8TEwye1FJB',
        type: 'paragraph',
        children: [
          {
            text: "Pour participer à l'événement, pensez à consulter [votre partenaire](https://www.jota.one).\n\nVous pouvez directement joindre Jorinho ou Tadai pour toutes questions sur Jota.",
          },
        ],
      },
      {
        id: 'DiWvCP6i76',
        type: 'AddressBlock',
        props: {
          person: {
            firstName: 'Juniors',
            lastName: 'Jota',
            title: 'Chief Architects',
            street: 'Inifinite Loop π',
            zip: 9999,
            city: 'Magic City',
            phone: '+41 (0) 79 123 45 67',
            email: 'juniors@jota.one',
          },
        },
        children: [
          {
            id: 'lalala',
            type: 'BlockTitle',
            props: {
              text: 'Du contenu!!',
            },
          },
          {
            id: 'lalaolo',
            type: 'BlockImage',
            props: {
              src: 'https://images.unsplash.com/photo-1730871082254-65b6e151c82b?q=80&w=400',
              alt: 'Une belle photo',
            },
            children: [
              {
                text: "J'aime **mon** visage.",
              },
            ],
          },
        ],
      },
      {
        id: 'a83NvChRog',
        type: 'BlockSpace',
        props: {
          size: 'half',
        },
      },
      {
        id: 'LEnB2vS5Kp',
        type: 'BlockTitle',
        props: {
          text: 'Qui sommes-nous ?',
        },
      },
      {
        id: 'wA7veeaJsM',
        type: 'paragraph',
        children: [
          {
            text: "Ce texte pourrait être généré par une IA, mais je sais encore écrire du bulk texte inutile si besoin. Donc je le fais avant que le monde décide que perdre 5 minutes à écrire du texte de remplissage est plus dommageable que construire des datacenters qui consomment autant que des villes pour qu'un bot abruti génère ce texte à notre place.",
          },
        ],
      },
      {
        id: 'xZXUqFaNTM',
        type: 'paragraph',
        children: [
          {
            text: "Avec tout ça, je n'ai pas présenté l'entreprise, mais on se fait déjà une vague idée de notre vision en lisant le paragraphe ci-dessus, non?",
          },
        ],
      },
      {
        id: 'nR7cRoncoL',
        type: 'BlockSpace',
        props: {
          size: 'half',
        },
      },
      {
        id: 'mBpixTX7_i',
        type: 'BlockTitle',
        props: {
          text: 'Buts',
        },
      },
      {
        id: '74duZSCIWA',
        type: 'paragraph',
        children: [
          {
            text: "Le but c'est surtout de continuer de produire des trucs intéressants et originaux alors que le monde sombre dans l'uniformité des LLM.",
          },
        ],
      },
      {
        id: 'iz1ESzGfiK',
        type: 'paragraph',
        children: [
          {
            text: 'Le vrai auteur de cette lithanie\n\n**Jorinho**',
          },
        ],
      },
    ]),
    state: 'published',
    editorVersion: '2.26.5',
    name: '',
  })
  dao.saveRecord(contactFrContent)
  const contactEnContent = new Record(HcContents, {
    blocks: JSON.stringify([]),
    state: 'published',
    editorVersion: '2.26.5',
    name: '',
  })
  dao.saveRecord(contactEnContent)
  const aboutFrContent = new Record(HcContents, {
    blocks: JSON.stringify([
      {
        id: 'apropo423',
        type: 'BlockTitle',
        props: {
          text: 'A propos de nous',
        },
      },
      {
        id: 'arow1',
        type: 'Row',
        props: {
          columns: 3,
        },
        children: [
          {
            id: 'col42423',
            type: 'Column',
            children: [
              {
                id: 'titojojo',
                type: 'BlockTitle',
                props: {
                  text: 'Jorinho',
                },
              },
              {
                id: 'paparagrphpa',
                type: 'Paragraph',
                children: [
                  {
                    text: "Un être d'exception qui saura vous faire vibrer par sa simple présence scénique. Le problème c'est qu'il ne monte pas sur scène.",
                  },
                ],
              },
              {
                id: 'a83NvChRog',
                type: 'BlockSpace',
                props: {
                  size: 'half',
                },
              },
              {
                id: 'tatadjoj',
                type: 'BlockTitle',
                props: {
                  text: 'Tadai',
                },
              },
              {
                id: 'paparagrphpa2',
                type: 'Paragraph',
                children: [
                  {
                    text: "La polyvalence incarnée. Il sait tout faire. Malheureusement il n'a pas le temps.",
                  },
                ],
              },
            ],
          },
          {
            id: 'col4243323',
            type: 'Column',
            props: {
              span: 2,
            },
            children: [
              {
                id: 'lalaolo',
                type: 'BlockImage',
                props: {
                  src: 'https://images.unsplash.com/photo-1730871082254-65b6e151c82b?q=80&w=400',
                  alt: 'Une belle photo',
                },
                children: [
                  {
                    text: 'Là, ils sont en plein travail.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
    state: 'published',
    editorVersion: '2.26.5',
    name: '',
  })
  dao.saveRecord(aboutFrContent)
  const aboutEnContent = new Record(HcContents, {
    blocks: JSON.stringify([]),
    state: 'published',
    editorVersion: '2.26.5',
    name: '',
  })
  dao.saveRecord(aboutEnContent)

  const homePageFr = new Record(HcPagesLang, {
    Page: homePage.id,
    Lang: frLang.id,
    slug: '',
    label: 'Accueil',
    Content: homeFrContent.id,
  })
  dao.saveRecord(homePageFr)
  const homePageEn = new Record(HcPagesLang, {
    Page: homePage.id,
    Lang: enLang.id,
    slug: '',
    label: 'Welcome',
    Content: homeEnContent.id,
  })
  dao.saveRecord(homePageEn)
  const contactPageFr = new Record(HcPagesLang, {
    Page: contactPage.id,
    Lang: frLang.id,
    slug: 'contactez-nous',
    label: 'Contactez-nous!',
    Content: contactFrContent.id,
  })
  dao.saveRecord(contactPageFr)
  const contactPageEn = new Record(HcPagesLang, {
    Page: contactPage.id,
    Lang: enLang.id,
    slug: 'contact-us',
    label: 'Contact us!',
    Content: contactEnContent.id,
  })
  dao.saveRecord(contactPageEn)
  const aboutPageFr = new Record(HcPagesLang, {
    Page: aboutPage.id,
    Lang: frLang.id,
    slug: 'a-propos',
    label: 'A propos de nous',
    Content: aboutFrContent.id,
  })
  dao.saveRecord(aboutPageFr)
  const aboutPageEn = new Record(HcPagesLang, {
    Page: aboutPage.id,
    Lang: enLang.id,
    slug: 'about-us',
    label: 'About us!',
    Content: aboutEnContent.id,
  })
  dao.saveRecord(aboutPageEn)

  const sql =
    'INSERT INTO `HcLabels` (`key`, `Lang`, `value`) VALUES\n' +
    "('common_login', '" +
    frLang.id +
    "', 'Connexion'),\n" +
    "('common_login', '" +
    enLang.id +
    "', 'Login'),\n" +
    "('common_logout', '" +
    frLang.id +
    "', 'Déconnexion'),\n" +
    "('common_logout', '" +
    enLang.id +
    "', 'Logout'),\n" +
    "('common_page_not_found', '" +
    frLang.id +
    "', 'Page introuvable'),\n" +
    "('common_page_not_found', '" +
    enLang.id +
    "', 'Page not found'),\n" +
    "('common_edit', '" +
    frLang.id +
    "', 'Editer'),\n" +
    "('common_edit', '" +
    enLang.id +
    "', 'Edit'),\n" +
    "('common_modify', '" +
    frLang.id +
    "', 'Modifier'),\n" +
    "('common_modify', '" +
    enLang.id +
    "', 'Modify'),\n" +
    "('common_save', '" +
    frLang.id +
    "', 'Sauvegarder'),\n" +
    "('common_save', '" +
    enLang.id +
    "', 'Save'),\n" +
    "('common_cancel', '" +
    frLang.id +
    "', 'Annuler'),\n" +
    "('common_cancel', '" +
    enLang.id +
    "', 'Cancel'),\n" +
    "('common_confirm', '" +
    frLang.id +
    "', 'Confirmer'),\n" +
    "('common_confirm', '" +
    enLang.id +
    "', 'Confirm'),\n" +
    "('common_yes', '" +
    frLang.id +
    "', 'Oui'),\n" +
    "('common_yes', '" +
    enLang.id +
    "', 'Yes'),\n" +
    "('common_no', '" +
    frLang.id +
    "', 'Non'),\n" +
    "('common_no', '" +
    enLang.id +
    "', 'No'),\n" +
    "('common_enabled', '" +
    frLang.id +
    "', 'Activé(s)'),\n" +
    "('common_enabled', '" +
    enLang.id +
    "', 'Enabled'),\n" +
    "('common_disabled', '" +
    frLang.id +
    "', 'Désactivé(s)'),\n" +
    "('common_disabled', '" +
    enLang.id +
    "', 'Disabled'),\n" +
    "('common_close', '" +
    frLang.id +
    "', 'Fermer'),\n" +
    "('common_close', '" +
    enLang.id +
    "', 'Close'),\n" +
    "('common_notfound', '" +
    frLang.id +
    "', 'Introuvable'),\n" +
    "('common_notfound', '" +
    enLang.id +
    "', 'Not found'),\n" +
    "('common_untranslated', '" +
    frLang.id +
    "', 'Non traduit'),\n" +
    "('common_untranslated', '" +
    enLang.id +
    "', 'Untranslated'),\n" +
    "('editor_not_ready_for_save', '" +
    frLang.id +
    "', 'L''éditeur n''est pas prêt pour la sauvegarde'),\n" +
    "('editor_not_ready_for_save', '" +
    enLang.id +
    "', 'Editor is not ready for saving data'),\n" +
    "('editor_init_placeholder', '" +
    frLang.id +
    "', 'Cliquer ici pour ajouter du contenu...'),\n" +
    "('editor_init_placeholder', '" +
    enLang.id +
    "', 'Click here to start writing content...'),\n" +
    "('hc_common_create', '" +
    frLang.id +
    "', 'Créer'),\n" +
    "('hc_common_create', '" +
    enLang.id +
    "', 'Create'),\n" +
    "('hc_common_export', '" +
    frLang.id +
    "', 'Exporter'),\n" +
    "('hc_common_export', '" +
    enLang.id +
    "', 'Export'),\n" +
    "('hc_search_entities', '" +
    frLang.id +
    "', 'Rechercher des {entities}'),\n" +
    "('hc_search_entities', '" +
    enLang.id +
    "', 'Search {entities}'),\n" +
    "('hc_common_import', '" +
    frLang.id +
    "', 'Importer'),\n" +
    "('hc_common_import', '" +
    enLang.id +
    "', 'Import'),\n" +
    "('hc_common_merge', '" +
    frLang.id +
    "', 'Fusionner'),\n" +
    "('hc_common_merge', '" +
    enLang.id +
    "', 'Merge'),\n" +
    "('hc_users', '" +
    frLang.id +
    "', 'Utilisateurs'),\n" +
    "('hc_users', '" +
    enLang.id +
    "', 'Users'),\n" +
    "('hc_error_pending_user_not_found', '" +
    frLang.id +
    "', 'Aucun utilisateur en attente trouvé'),\n" +
    "('hc_error_pending_user_not_found', '" +
    enLang.id +
    "', 'No pending user found');"
  db.newQuery(sql).execute()
})
