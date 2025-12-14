import { IEventDataMenu } from './test-data';

export class TEventDataMenu implements IEventDataMenu {
  Path = '2010/Text';

  Menu = [
    {
      Folder: 'Test',
      Items: ['FleetTest', 'NameTest'],
    },
    {
      Folder: 'IDM-420',
      Items: ['IDM-420-1991', 'IDM-420-1997', 'IDM-420-2000', 'IDM-420-2004'],
    },
    {
      Folder: 'A-2004',
      Items: [
        'A-2004-49er',
        'A-2004-470-M',
        'A-2004-470-W',
        'A-2004-Europe',
        'A-2004-Finn',
        'A-2004-Laser',
        'A-2004-Mistral-M',
        'A-2004-Mistral-W',
        'A-2004-Star',
        'A-2004-Tornado',
        'A-2004-Yngling',
      ],
    },
    {
      Folder: 'C-2007',
      Items: [
        'C-2007-49er',
        'C-2007-470-M',
        'C-2007-470-W',
        'C-2007-Finn',
        'C-2007-Laser-Radial',
        'C-2007-Laser',
        'C-2007-RSX-M',
        'C-2007-RSX-W',
        'C-2007-Star',
        'C-2007-Tornado',
        'C-2007-Yngling',
      ],
    },
    {
      Folder: 'Q-2008',
      Items: [
        'Q-2008-49er',
        'Q-2008-470-M',
        'Q-2008-470-W',
        'Q-2008-Finn',
        'Q-2008-Laser-Radial',
        'Q-2008-Laser',
        'Q-2008-RSX-M',
        'Q-2008-RSX-W',
        'Q-2008-Star',
        'Q-2008-Tornado',
        'Q-2008-Yngling',
      ],
    },
  ];
}
