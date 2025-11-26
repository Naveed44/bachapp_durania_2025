part of 'map_controller_cubit.dart';

@immutable
sealed class MapControllerState {
}

final class MapControllerInitial extends MapControllerState {
}

final class MapControllerLoaded extends MapControllerState {
    final MapController mapController;
    MapControllerLoaded(this.mapController);
}
