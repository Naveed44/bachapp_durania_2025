import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part 'map_toggle_state.dart';

class MapToggleCubit extends Cubit<Map<String, bool>> {
    MapToggleCubit() : super(
        {
            "inboundRoute": true,
            "outboundRoute": true,
            "markers": true
        }
        );

    void toggle(String key) {
        emit({
            ...state,
            key: !state[key]!
        }
        );
    }

    void reset() {
        emit({
            "inboundRoute": true,
            "outboundRoute": true,
            "markers": true
        }
        );
    }
}
