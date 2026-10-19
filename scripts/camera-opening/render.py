import bpy, json, math, sys, os
from mathutils import Matrix, Vector

ROOT=os.environ.get('WM_RENDER_DIR','/tmp/wm-camera-render')
with open(ROOT+'/scene.json') as f: data=json.load(f)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine=os.environ.get('WM_ENGINE','CYCLES')
scene.cycles.device='CPU'
scene.cycles.samples=int(os.environ.get('WM_SAMPLES','32'))
scene.cycles.use_denoising=True
scene.cycles.adaptive_threshold=.035
scene.cycles.seed=17
scene.cycles.use_animated_seed=False
scene.render.use_persistent_data=True
if scene.render.engine=='BLENDER_EEVEE_NEXT': scene.eevee.taa_render_samples=24
scene.render.threads_mode='FIXED'; scene.render.threads=8
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
scene.view_settings.exposure=.0
scene.render.resolution_x=int(os.environ.get('WM_WIDTH','1120'))
scene.render.resolution_y=int(os.environ.get('WM_HEIGHT','650'))
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.world=bpy.data.worlds.new('Dark studio')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.11,.13,.15,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.025

materials={}
for id,m in data['materials'].items():
 mat=bpy.data.materials.new(id); mat.use_nodes=True
 nodes=mat.node_tree.nodes; links=mat.node_tree.links
 bs=nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*m['color'],1)
 bs.inputs['Metallic'].default_value=m['metalness']
 bs.inputs['Roughness'].default_value=m['roughness']
 bs.inputs['Coat Weight'].default_value=m['clearcoat']
 if m.get('bumpMap'):
  bs.inputs['Metallic'].default_value=min(.25,m['metalness'])
  bs.inputs['Specular IOR Level'].default_value=.09 if m['roughness']>.6 else .25
 if m['transmission']:
  bs.inputs['Base Color'].default_value=(.57,.67,.75,1)
  bs.inputs['Transmission Weight'].default_value=.98
  bs.inputs['IOR'].default_value=1.22
  bs.inputs['Coat Weight'].default_value=.35
 if m.get('map'):
  tex=nodes.new('ShaderNodeTexImage'); tex.image=bpy.data.images.load(ROOT+'/'+data['textures'][m['map']]['file'])
  links.new(tex.outputs['Color'],bs.inputs['Base Color']); links.new(tex.outputs['Alpha'],bs.inputs['Alpha'])
  if m['basic']:
   links.new(tex.outputs['Color'],bs.inputs['Emission Color']); bs.inputs['Emission Strength'].default_value=.6
  mat.surface_render_method='DITHERED'
 if m.get('bumpMap'):
  noise=nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value=65 if m['roughness']>.6 else 180
  noise.inputs['Detail'].default_value=2
  bump=nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.35 if m['roughness']>.6 else .12; bump.inputs['Distance'].default_value=.04 if m['roughness']>.6 else .018
  links.new(noise.outputs['Fac'],bump.inputs['Height']); links.new(bump.outputs['Normal'],bs.inputs['Normal'])
 materials[id]=mat

geometries={}
for id,g in data['geometries'].items():
 verts=list(zip(*[iter(g['position'])]*3))
 indices=g['index'] or list(range(len(verts)))
 faces=list(zip(*[iter(indices)]*3))
 mesh=bpy.data.meshes.new(id); mesh.from_pydata(verts,[],faces); mesh.update()
 if g['uv']:
  uv=mesh.uv_layers.new(name='UVMap'); coords=list(zip(*[iter(g['uv'])]*2))
  for loop in mesh.loops: uv.data[loop.index].uv=coords[loop.vertex_index]
 for p in mesh.polygons: p.use_smooth=True
 if g['normal']: mesh.normals_split_custom_set_from_vertices(list(zip(*[iter(g['normal'])]*3)))
 geometries[id]=mesh

groups={}
for name in ['body','lens']:
 ob=bpy.data.objects.new(name,None); scene.collection.objects.link(ob); groups[name]=ob
for i,item in enumerate(data['objects']):
 mesh=geometries[item['geometry']]
 ob=bpy.data.objects.new(str(i),mesh); scene.collection.objects.link(ob)
 if not mesh.materials:
  mesh.materials.append(materials[item['material']])
  if data['materials'][item['material']]['transmission']:
   mesh.flip_normals()
   mesh.normals_split_custom_set([(0,0,0)]*len(mesh.loops))
 ob.parent=groups[item['parent']]
 ob.matrix_local=Matrix([item['matrix'][i:i+4] for i in range(0,16,4)]).transposed()

def material(name,color,metal=.0,rough=.4):
 mat=bpy.data.materials.new(name); mat.use_nodes=True
 bs=mat.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Metallic'].default_value=metal; bs.inputs['Roughness'].default_value=rough
 return mat

bpy.ops.mesh.primitive_plane_add(size=2000,location=(0,-4.03,0),rotation=(math.pi/2,0,0))
floor=bpy.context.object; floor.data.materials.append(material('Graphite studio floor',(.009,.012,.014),.15,.49))

def orient(obj,target):
 z=(obj.location-Vector(target)).normalized(); x=Vector((0,1,0)).cross(z).normalized(); y=z.cross(x)
 rot=Matrix((x,y,z)).transposed().to_4x4(); obj.matrix_world=Matrix.Translation(obj.location)@rot
def area(name,at,power,size,size_y=None,target=(0,0,2),color=(1,1,1)):
 light=bpy.data.lights.new(name,'AREA'); light.energy=power; light.shape='RECTANGLE'; light.size=size; light.size_y=size_y or size; light.color=color
 obj=bpy.data.objects.new(name,light); scene.collection.objects.link(obj); obj.location=at; orient(obj,target)
area('Large soft key',(-11,16,14),3300,13,7)
area('Right strip',(14,7,4),3000,2,17)
area('Rear strip',(-14,6,-8),4200,2,15)
area('Top rim',(0,12,-10),3200,13,3)
area('Lens reflection',(-6,2,22),500,2,8)
camera_data=bpy.data.cameras.new('Camera'); camera=bpy.data.objects.new('Camera',camera_data); scene.collection.objects.link(camera); scene.camera=camera
camera_data.type='PERSP'; camera_data.sensor_fit='VERTICAL'; camera_data.sensor_height=24
camera_data.lens=24/(2*math.tan(math.radians(15)))
camera_data.clip_start=.5; camera_data.clip_end=400

def ease(t):
 t=max(0,min(1,t)); return t*t*(3-2*t)
def pose(t):
 approach=ease((t-.42)/1.85); twist=ease((t-2.25)/.48); orbit=ease(t/3.5)
 groups['lens'].location=(.4,-.1,.31+6.35*(1-approach)); groups['lens'].rotation_euler.z=-.29*(1-twist)
 theta=-.68+orbit*.2; aspect=scene.render.resolution_x/scene.render.resolution_y
 height=max(20.5,22.5/aspect)*(1+.06*orbit)
 distance=height/(2*math.tan(math.radians(15)))
 target=Vector((.15,.45,2.65+(1-approach)*2.15))
 camera.location=target+Vector((math.sin(theta)*distance,distance*.235,math.cos(theta)*distance)); orient(camera,target)

if len(sys.argv)>1 and sys.argv[1]=='film':
 os.makedirs(ROOT+'/frames',exist_ok=True)
 for frame in range(0,55):
  pose(frame/15)
  scene.render.filepath=ROOT+f'/frames/{frame:04d}.png'
  bpy.ops.render.render(write_still=True)
else:
 pose(float(sys.argv[1]) if len(sys.argv)>1 else 1.3)
 scene.render.filepath=ROOT+'/preview.png'; bpy.ops.render.render(write_still=True)
