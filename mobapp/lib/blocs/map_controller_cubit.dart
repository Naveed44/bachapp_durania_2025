import 'package:bloc/bloc.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:meta/meta.dart';

part 'map_controller_state.dart';

class MapControllerCubit extends Cubit<MapControllerState> {
    MapControllerCubit() : super(MapControllerInitial());

    void setMapController(MapController mapController) {
        emit(MapControllerLoaded(mapController));
    }

    MapController getMapController() => (state as MapControllerLoaded).mapController;
}
