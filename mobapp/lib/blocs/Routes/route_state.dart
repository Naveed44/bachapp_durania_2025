part of 'route_bloc.dart';

@immutable
sealed class RouteState {}

final class RouteInitial extends RouteState {}

final class RouteLoading extends RouteState {
}

final class RouteLoaded extends RouteState {
    final RouteModel selectedRoute;
    final List<Polyline>? outboundPolylines;
    final List<Polyline>? inboundPolylines;
    final List<Marker>? markers;
    final List<Marker>? baseMarker;

    RouteLoaded({
        required this.selectedRoute,
        this.outboundPolylines,
        this.inboundPolylines,
        this.markers,
        this.baseMarker
    });
}

final class RouteError extends RouteState {
    final String message;

    RouteError(this.message);
}
