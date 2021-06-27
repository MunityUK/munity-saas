import classnames from 'classnames';
import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { Label } from 'src/components/form';
import {
  CheckboxGroup,
  CheckboxGroupProps
} from 'src/components/form/lib/checkbox';
import { getComplaints } from 'src/pages/api/complaints';
import { RACE_OPTIONS, SEX_OPTIONS } from 'src/utils/constants';
import { parse } from 'src/utils/helper';
import {
  Complaint,
  ComplaintStatus,
  IncidentType,
  ListItem,
  BristolPoliceStations
} from 'types';

const VoiceraMap = Dynamic(() => import('src/components/map'), {
  ssr: false
});

export default function Home({ allComplaints }: HomeProps) {
  const [complaints, setComplaints] = useState(allComplaints);
  const [filters, setFilters] = useState<MapFilters>({});

  useEffect(() => {
    filterComplaints();
  }, [JSON.stringify(filters)]);

  /** Filter the list of complaints by specified property. */
  const filterComplaints = () => {
    const filteredComplaints = allComplaints.filter((complaint) => {
      return Object.entries(filters).every(([property, values]) => {
        if (!values || !values.length) return true;
        const key = property as keyof Complaint;
        return values.includes(complaint[key]!.toString());
      });
    });

    setComplaints(filteredComplaints);
  };

  /**
   * Set a new filter on check.
   * @param e The change event.
   */
  const onFilterCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    setFilters((filters) => {
      const values = filters[name as keyof Complaint] || [];
      if (checked) {
        if (!values.includes(value)) {
          values.push(value);
        }
      } else {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }
      }
      return { ...filters, [name]: values };
    });
  };

  return (
    <div className={'map-page'}>
      <Head>
        <title>Voicera</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main className={'map-main'}>
        <div className={'map-sidebar'}>
          {MAP_FILTER_FIELDS.map((props, key) => {
            return (
              <FilterField
                {...props}
                checkedValues={filters[props.name]!}
                onChange={onFilterCheck}
                key={key}
              />
            );
          })}
        </div>
        <VoiceraMap complaints={complaints} />
      </main>
    </div>
  );
}

/** A field for the dropdown menu to filter map markers by property. */
const FilterField = (props: MapFilterProps) => {
  const { label, name, items, onChange, checkedValues } = props;
  const [isFolded, setFolded] = useState(true);

  const classes = classnames('map-sidebar-field-checkboxes', {
    'map-sidebar-field-checkboxes--visible': !isFolded
  });
  return (
    <div className={'map-sidebar-field'}>
      <Label
        className={'map-sidebar-field__label'}
        onClick={() => setFolded(!isFolded)}>
        {label}
        {isFolded && <span className={'map-sidebar-field__label-drop'}>&#8964;</span>}
      </Label>
      <CheckboxGroup
        name={name}
        items={items}
        onChange={onChange}
        checkedValues={checkedValues}
        className={classes}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { allComplaints: parse(complaints) ?? [] }
  };
};

const MAP_FILTER_FIELDS: Array<MapFilterField> = [
  {
    label: 'Incident Type',
    name: 'incidentType',
    items: Object.values(IncidentType)
  },
  {
    label: 'Station',
    name: 'station',
    items: BristolPoliceStations
  },
  {
    label: 'Status',
    name: 'status',
    items: Object.values(ComplaintStatus)
  },
  {
    label: 'Officer Race',
    name: 'officerRace',
    items: RACE_OPTIONS
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: SEX_OPTIONS
  },
  {
    label: 'Complainant Race',
    name: 'complainantRace',
    items: RACE_OPTIONS
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: SEX_OPTIONS
  }
];

interface HomeProps {
  /** The full list of complaints from the server. */
  allComplaints: Array<Complaint>;
}

interface MapFilterProps extends CheckboxGroupProps {
  /** The label text. */
  label: string;
  /** The property of the field to filter on. */
  name: keyof Complaint;
}

type MapFilters = {
  [key in keyof Complaint]: Array<string>;
};

type MapFilterField = {
  label: string;
  name: keyof Complaint;
  items: Array<ListItem>;
};
