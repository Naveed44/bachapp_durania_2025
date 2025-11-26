part of 'route_groups_bloc.dart';

@immutable
sealed class RoutesEvent {}

class RouteGroupsLoadRoutes extends RoutesEvent {}