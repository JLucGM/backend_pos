import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Switch } from '@/Components/ui/switch';

const DAYS = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export default function StoreSchedulesForm({ data, setData, errors }) {
    
    const handleScheduleChange = (index, field, value) => {
        const newSchedules = [...data.schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setData('schedules', newSchedules);
    };

    return (
        <div className="space-y-4 mt-6 border-t pt-6">
            <h3 className="text-lg font-medium">Horarios de Atención</h3>
            <p className="text-sm text-gray-500 mb-4">Configura los horarios en los que tu tienda está abierta para retiros y entregas.</p>
            
            <div className="space-y-3">
                {DAYS.map((day, index) => {
                    const schedule = data.schedules.find(s => s.day_of_week === index) || {
                        day_of_week: index,
                        open_time: '09:00',
                        close_time: '18:00',
                        is_closed: false
                    };

                    // Encontrar el índice real en el array de data.schedules
                    const scheduleIndex = data.schedules.findIndex(s => s.day_of_week === index);

                    return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 gap-4">
                            <div className="w-32 font-medium">{day}</div>
                            
                            <div className="flex items-center gap-4 flex-1 justify-end">
                                {!schedule.is_closed ? (
                                    <div className="flex items-center gap-2">
                                        <TextInput
                                            type="time"
                                            value={schedule.open_time || ''}
                                            onChange={(e) => handleScheduleChange(scheduleIndex, 'open_time', e.target.value)}
                                            className="w-32 h-9 text-sm"
                                        />
                                        <span className="text-gray-400">a</span>
                                        <TextInput
                                            type="time"
                                            value={schedule.close_time || ''}
                                            onChange={(e) => handleScheduleChange(scheduleIndex, 'close_time', e.target.value)}
                                            className="w-32 h-9 text-sm"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-sm text-red-500 font-medium py-2">Cerrado</span>
                                )}

                                <div className="flex items-center gap-2 border-l pl-4">
                                    <span className="text-xs text-gray-500">{schedule.is_closed ? 'Cerrado' : 'Abierto'}</span>
                                    <Switch
                                        checked={!schedule.is_closed}
                                        onCheckedChange={(checked) => handleScheduleChange(scheduleIndex, 'is_closed', !checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
