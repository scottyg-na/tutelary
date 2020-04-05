import fetch from 'node-fetch';
import Constants from 'constants';

const MEETINGS_API = 'https://bmlt.virtual-na.org/main_server/client_interface/json/';
const MEETINGS_API_PARAMS = ['?switcher=GetSearchResults&data_field_key=duration_time,start_time,weekday_tinyint,service_body_bigint,',
  'longitude,latitude,location_province,location_municipality,location_info,location_text,formats,format_shared_id_list,comments,',
  'meeting_name,id_bigint,meeting_name,location_text,formatted_comments&recursive=0&sort_keys=start_time'].join();

export const getMeetingsFromVirtualNA = async () => {
  const response = await fetch(`${MEETINGS_API}${MEETINGS_API_PARAMS}`);
  const responseJson = await response.json();

  // Converts Virtual NA weekday to Luxon Weekday.
  const convertWeekday = (day: int) => {
    switch (day) {
      case 1:
        return 7;
      case 2:
        return 1;
      case 3:
        return 2;
      case 4:
        return 3;
      case 5:
        return 4;
      case 6:
        return 5;
      case 7:
        return 6;
      default:
        break;
    }
  };

  const getTimezoneForSourceService = (sourceService: int) => {
    switch (sourceService) {
      // Australia
      case 1:
      case 13:
        return 'Australia/Melbourne';
        // Highlands (Scotland)
      case 2:
        return 'Europe/London';
        // America (All)
      case 3:
        return 'America/New_York';
        // Vancouver
      case 4:
        return 'America/Vancouver';
        // Rome
      case 5:
        return 'Europe/Rome';
      default:
        return 'GMT';
    }
  };

  const meetings = responseJson.map((m) => {
    const meeting = {};
    meeting.id = `virtual-na-${m.id_bigint}`;
    meeting.name = m.meeting_name;
    meeting.source = Constants.Meetings.Sources.VIRTUAL_NA;
    meeting.sourceService = parseInt(m.service_body_bigint, 10);
    meeting.location = m.comments;
    meeting.locationDescription = m.location_text;
    meeting.formats = m.formats.split(',');
    meeting.start = m.start_time;
    meeting.duration = m.duration_time;
    meeting.timezone = getTimezoneForSourceService(meeting.sourceService);
    meeting.weekday = convertWeekday(parseInt(m.weekday_tinyint, 10));

    return meeting;
  });

  return meetings;
};
