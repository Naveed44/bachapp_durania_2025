part of 'route_groups_bloc.dart';

@immutable
sealed class RouteGroupsState {}

final class RouteGroupsInitial extends RouteGroupsState {}

final class RouteGroupsLoading extends RouteGroupsState {}

final class RouteGroupsLoaded extends RouteGroupsState {
  final List<RouteGroupModel> routes;
  RouteGroupsLoaded({required this.routes});
}

final class RouteGroupsError extends RouteGroupsState {
  final String message;
  RouteGroupsError({required this.message});
}


