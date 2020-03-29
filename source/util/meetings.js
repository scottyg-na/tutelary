import fetch from 'node-fetch';
import getBotDateTime from 'util/date/getBotDateTime';
import { DateTime } from 'luxon';

const MEETINGS_API = 'https://bmlt.virtual-na.org/main_server/client_interface/json/';
const MEETINGS_API_PARAMS = '?switcher=GetSearchResults&data_field_key=duration_time,start_time,weekday_tinyint,service_body_bigint,longitude,latitude,location_province,location_municipality,location_info,location_text,formats,format_shared_id_list,comments,meeting_name,id_bigint,meeting_name,location_text,formatted_comments&services[]=1&services[]=13&recursive=0&sort_keys=start_time';

export const getAllMeetings = async () => {
    const response = await fetch(`${MEETINGS_API}${MEETINGS_API_PARAMS}`);
    const responseJson = await response.json();
    return responseJson;
}

export const getAllMeetingsForDate = async (date: DateTime = getBotDateTime()) => {
    const meetings = await getAllMeetings();

    const filtered = meetings.filter(m => {
        const day = parseInt(m.weekday_tinyint, 10);
        const dayLocal = date.weekday;
        if (day === 1 && dayLocal === 7) return true;
        if (day === 2 && dayLocal === 1) return true;
        if (day === 3 && dayLocal === 2) return true;
        if (day === 4 && dayLocal === 3) return true;
        if (day === 5 && dayLocal === 4) return true;
        if (day === 6 && dayLocal === 5) return true;
        if (day === 7 && dayLocal === 6) return true;
        return false;
    });

    return filtered;
}