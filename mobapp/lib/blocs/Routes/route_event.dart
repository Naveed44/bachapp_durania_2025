part of 'route_bloc.dart';

@immutable
sealed class RouteEvent {}

class LoadRouteById extends RouteEvent {
    final String routeGroupId;
    final String routeId;
    final MapController? mapController;
    LoadRouteById({
        required this.routeGroupId,
        required this.routeId,
        this.mapController
    });
}

class UnloadRoute extends RouteEvent {}

