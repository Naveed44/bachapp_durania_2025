
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../blocs/RouteGroups/route_groups_bloc.dart';
import '../components/RouteGroupListWidget.dart';

class RouteGroupsPage extends StatelessWidget {
    const RouteGroupsPage({super.key});

    @override
    Widget build(BuildContext context) {
        return Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    /*SliverAppBar(
                    title: Text('Rutas'),
                    primary: false,
                    pinned: true,
                    centerTitle: false,
                    backgroundColor: Colors.white,
                ),*/
                    /*const Text(
                        'Rutas',
                        style: TextStyle(
                            fontSize: 20
                        ),
                    ),*/
                    const ListTile(
                        title: Text('Rutas', style: TextStyle(fontSize: 20)),
                        visualDensity: VisualDensity.compact,
                        contentPadding: EdgeInsets.zero
                    ),
                    SizedBox.fromSize(size: const Size(0, 10)),
                    BlocBuilder<RouteGroupsBloc, RouteGroupsState>(
                        builder: (context, state) {
                            switch(state.runtimeType) {
                                case RouteGroupsInitial:
                                case RouteGroupsLoading:
                                    return Center(
                                        child: CircularProgressIndicator(
                                            color: Theme.of(context).hintColor
                                        ),
                                    );
                                case RouteGroupsLoaded:
                                    return Column(
                                        children: (state as RouteGroupsLoaded).routes.map(
                                            // (e) => ListTile(title: Text(e.name))
                                            (e) => RouteGroupListWidget(routeGroupModel: e)
                                        ).toList()
                                    );
                                case RouteGroupsError:
                                    return Center(
                                        child: Text((state as RouteGroupsError).message),
                                    );
                                default:
                                return const Center(
                                    child: Text('¿Como has llegado aquí?'),
                                );
                            }
                        }
                    )
                ],
            )
        );
    }

}
