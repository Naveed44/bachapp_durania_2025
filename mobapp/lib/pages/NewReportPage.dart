import 'package:flutter/material.dart';

class NewReportPage extends StatefulWidget {
  const NewReportPage({super.key});

  @override
  State<NewReportPage> createState() => _NewReportPageState();
}

class _NewReportPageState extends State<NewReportPage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
              onTap: () {
                Navigator.of(context).pop();
              },
              title: const Text('Nuevo reporte',
                  style: const TextStyle(fontSize: 20)),
              leading: const Icon(Icons.arrow_back_ios, size: 20),
              visualDensity: VisualDensity.compact,
              contentPadding: EdgeInsets.zero),
          const SizedBox(height: 10),
          const Text(
              'Llena los siguientes detalles y sube fotos para crear un reporte.',
              style: const TextStyle(fontSize: 14)),
          const SizedBox(height: 20),
          const Text('¿Como consideras la gravedad del bache?',
              style: const TextStyle(fontSize: 16)),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              /*IconButton(
                onPressed: () {},
                icon: const Icon(
                  Icons.tag_faces_outlined,
                  size: 30,
                ),
              ),*/
              Column(children: [
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    fixedSize: const Size(50, 60),
                    side: const BorderSide(
                      color: Colors.yellow,
                      width: 2.0,
                    ),
                  ),
                  onPressed: () {

                  },
                  child: const Text('😐', style: TextStyle(fontSize: 16)),
                ),
                const Text('Media', style: const TextStyle(fontSize: 12)),
              ]),
              Column(children: [
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    fixedSize: const Size(50, 60),
                    side: const BorderSide(
                      color: Colors.orange,
                      width: 2.0,
                    ),
                  ),
                  onPressed: () {

                  },
                  child: const Text('😫', style: TextStyle(fontSize: 16)),
                ),
                const Text('Grave', style: const TextStyle(fontSize: 12)),
              ]),
              Column(children: [
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    fixedSize: const Size(50, 60),
                    side: const BorderSide(
                      color: Colors.red,
                      width: 2.0,
                    ),
                  ),
                  onPressed: () {

                  },
                  child: const Text('😠', style: TextStyle(fontSize: 16)),
                ),
                const Text('Muy grave', style: const TextStyle(fontSize: 12)),
              ]),
            ],
          ),
          const SizedBox(height: 20),
          const Text('Ubicación', style: const TextStyle(fontSize: 14)),
          const SizedBox(height: 10),
          Row(children: [
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.7,
              child: const TextField(
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Direccion',
                ),
              ),
            ),
            const SizedBox(width: 10),
            IconButton(
                style: IconButton.styleFrom(
                  side: BorderSide(
                    color: Colors.grey[500]!,
                    width: 2.0,
                  ),
                ),
                onPressed: () {},
                icon: const Icon(Icons.location_on_outlined, size: 30))
          ]),
          const SizedBox(height: 10),
          const SizedBox(height: 20),
          const Text('Otorga una descripcion del bache y/o sus alrededores.',
              style: const TextStyle(fontSize: 14)),
          const SizedBox(height: 10),
          const TextField(
            maxLines: 5,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Descripción',
            ),
          ),
          const SizedBox(height: 20),
          const Text('Fotografías', style: const TextStyle(fontSize: 14)),
          const SizedBox(height: 10),
          // make a container for the images
          Container(
            height: 100,
            decoration: BoxDecoration(
              border:
                  Border.all(color: Colors.grey, style: BorderStyle.values[1]),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // add a button to add an image and a camera icon
                IconButton(
                  icon: const Icon(Icons.photo_library_outlined, size: 30),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.camera_alt, size: 30),
                  onPressed: () {},
                ),
              ],
            )
          ),
          const SizedBox(height: 30),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(50), // new
            ),
            onPressed: () {},
            child: const Text('Enviar reporte',
                style: const TextStyle(fontSize: 16)),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
